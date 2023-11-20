import express, { NextFunction, Request, Response } from 'express';
import downloadRouter from './routes/downloadRoutes';
import errorHandler from './errorHandler';
import cors from "cors";
const app = express();
const port = 3000;

app.use(cors({
    origin:["http://localhost:3000/"],
}));
app.use(express.json());
app.use("/social-downloader",downloadRouter);

app.use(errorHandler);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))