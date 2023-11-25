import ytdl from "ytdl-core";
const snapsave = require("snapsave-downloader-itj");
import { BadRequest } from "../errorHandler";
import { TwitterDL } from "twitter-downloader";
import { fetchVideo } from "@prevter/tiktok-scraper";
import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { load } from "cheerio";
import PinterestUtils from "../utils/pinterestUtils";

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
    const { url } = req.body;

    await ytdl
      .getInfo(url)
      .then((value) => {
        res.json({
          success: true,
          message: "Youtube Data has been fetched",
          data: value.player_response.streamingData.adaptiveFormats,
        });
      })
      .catch((err) => {
        next(err);
      });
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
  static async proxyServer(req:Request,res:Response,next:NextFunction){
    const {url}=req.query;
    console.log("proxy is running"+url);
    try{

      const response= await axios(url?.toString()??"",{responseType:"arraybuffer"});

      const data=await response.data;
      res.send(data);
    }catch(err){
      next(err);
    }

  }
}

export default DownloadController;
