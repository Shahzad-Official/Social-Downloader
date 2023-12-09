import express, { NextFunction, Request, Response } from 'express';
import downloadRouter from './routes/downloadRoutes';
import errorHandler from './errorHandler';
import cors from "cors";
const app = express();
const port = 4401;

app.use(cors({
    origin: ["http://localhost:4400","https://youtube-downloaders.com"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

  
app.use(express.json());
app.use("/api",downloadRouter);
app.use("/test",(req,res)=>{
    res.send("Working fine");
})
app.use(errorHandler);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))