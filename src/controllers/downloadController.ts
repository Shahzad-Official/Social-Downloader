const snapsave = require("snapsave-downloader-itj");
import { BadRequest } from "../errorHandler";
import { TwitterDL } from "twitter-downloader";
import { fetchVideo } from "@prevter/tiktok-scraper";
import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { load } from "cheerio";
import PinterestUtils from "../utils/pinterestUtils";
import { bytesToMB } from "../utils/conversions";
import youtubeDl from "youtube-dl-exec";
import nodemailer from "nodemailer";

interface YoutubeResponse {
  fileSize: number;
  hasAudio: boolean;
  extension: string;
  quality: string;
  url: string;
}

class DownloadController {
  static async downloadPinterestData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { url } = req.body;
    try {
      const response = await axios.get(url);
      const content = await response.data;
      const $ = load(content);
      let contentData;
      $('script[type="application/json"]').each((index, element) => {
        const scriptContent = $(element).html();
        if (scriptContent && scriptContent.includes(".mp4")) {
          contentData = scriptContent;
        }
      });
      const jsonObject = JSON.parse(contentData ?? "");
      const video = PinterestUtils.findMp4(jsonObject);
      const thumbnail = PinterestUtils.findThumbnail(jsonObject);
      const title = PinterestUtils.findTitle(jsonObject);

      res.json({ title: title, video: video, thumbnail: thumbnail });
    } catch (err) {
      next(err);
    }
  }
  static async downloadYoutubeVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { url, isMp3 } = req.body;

    await youtubeDl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    })
      .then(async (output) => {
        let formatedData;
        if (isMp3 === true) {
          formatedData = output.formats
            .filter(
              (value) =>
                value.asr != null &&
                value.acodec !== "none" &&
                value.fps === null
            )
            .map((result) => {
              var resultData = JSON.parse(JSON.stringify(result));
              return {
                fileSize: bytesToMB(
                  result.filesize ?? resultData.filesize_approx
                ),
                hasAudio: true,

                extension: result.ext,
                quality: result.format_note,
                url: result.url,
              };
            });
        } else {
          formatedData = output.formats
            .filter(
              (value) =>
                value.vcodec !== "none" &&
                value.ext !== "3gp" &&
                value.acodec !== "none"
              // (value.format_note === "144p" ||
              //   value.format_note === "240p" ||
              //   value.format_note === "360p" ||
              //   value.format_note === "720p" ||
              //   value.format_note === "1080p" ||
              //   value.format_note === "1440p" ||
              //   value.format_note === "2160p")
            )
            .map((result) => {
              var resultData = JSON.parse(JSON.stringify(result));
              return {
                fileSize: bytesToMB(
                  result.filesize ?? resultData.filesize_approx
                ),
                hasAudio: result.acodec !== "none" ? true : false,
                extension: result.ext,
                quality: result.format_note,
                url: result.url,
              };
            });
          formatedData.sort((a, b) =>
            a.hasAudio == b.hasAudio ? 0 : a.hasAudio ? -1 : 1
          );
        }

        const uniqueQualities: { [key: string]: boolean } = {};
        const filteredObjects: YoutubeResponse[] = [];

        formatedData.forEach((obj) => {
          const quality = obj.quality;
          if (!uniqueQualities[quality]) {
            uniqueQualities[quality] = true;
            filteredObjects.push(obj);
          }
        });
        res.json({
          videoId: output.id,
          title: output.title,
          thumbnail: output.thumbnails
            .filter((value) => value.width === 480)
            .at(-1)?.url,
          formats: filteredObjects,
        });
      })
      .catch((err) => next(err));
  }
  static async downloadInstaFb(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { url } = req.body;

    await snapsave(url)
      .then((value: any) => {
        if (value.status) {
          res.json({
            success: true,
            message: "Data has been fetched.",
            data: value,
          });
        } else {
          throw new BadRequest("Check your url");
        }
      })
      .catch((err: any) => {
        next(err);
      });
  }
  static async downloadTwitter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { url } = req.body;
    await TwitterDL(url)
      .then((value) => {
        res.json({
          success: true,
          message: "Twitter data has been fetched.",
          data: value,
        });
      })
      .catch((err) => next(err));
  }
  static async downloadTiktok(req: Request, res: Response, next: NextFunction) {
    const { url } = req.body;
    await fetchVideo(url)
      .then((value) => {
        res.json({
          success: true,
          message: "Tiktok video has been fetched.",
          data: value,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
  static async proxyServer(req: Request, res: Response, next: NextFunction) {
    const { url } = req.body;
    try {
      const response = await axios.get(url?.toString() ?? "", {
        responseType: "arraybuffer",
      });
      const data = await response.data;

      res.send(data);
    } catch (err) {
      next(err);
    }
  }

  static async sendEmail(req: Request, res: Response, next: NextFunction) {
    const { firstName, lastName, subject, email, message } = req.body;
    const transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: "Youtube-Downloader@outlook.com",
        pass: "qwertghjklytDown",
      },
    });
    const senderName = `${firstName} ${lastName}`;

    const mailOptions = {
      from: `"${senderName}" <Youtube-Downloader@outlook.com>`,
      to: "Youtube-Downloader@outlook.com",
      subject: subject,
      html: `
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
      replyTo: email,
    };
    try {
      const info = await transporter.sendMail(mailOptions);
      res.status(200).json({
        succes: true,
        message: "Message has been sent",
        info,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

}

export default DownloadController;
