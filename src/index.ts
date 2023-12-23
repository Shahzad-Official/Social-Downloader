import express, { NextFunction, Request, Response } from 'express';
import downloadRouter from './routes/downloadRoutes';
import errorHandler from './errorHandler';
import cors from "cors";
const app = express();
const port = 4401;

app.use(cors());

  
app.use(express.json());
app.use("/api",downloadRouter);
app.use("/api/test",(req,res)=>{
    res.send("Working fine");
})
app.use(errorHandler);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))