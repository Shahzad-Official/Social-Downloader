import { Router } from "express";
import DownloadController from "../controllers/downloadController";
import DownloadMiddleware from "../middlewares/downloadMiddleware";

const downloadRouter=Router();
downloadRouter.post("/yt",DownloadMiddleware.downloadMiddleware,DownloadController.downloadYoutubeVideo);
downloadRouter.post("/pinterest",DownloadMiddleware.downloadMiddleware,DownloadController.downloadPinterestData);
downloadRouter.post("/insta-fb",DownloadMiddleware.downloadMiddleware,DownloadController.downloadInstaFb);
downloadRouter.post("/twitter",DownloadMiddleware.downloadMiddleware,DownloadController.downloadTwitter);
downloadRouter.post("/tiktok",DownloadMiddleware.downloadMiddleware,DownloadController.downloadTiktok);

export default downloadRouter;