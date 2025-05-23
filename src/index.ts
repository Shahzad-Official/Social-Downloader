import express from "express";
import downloadRouter from "./routes/downloadRoutes";
import errorHandler from "./errorHandler";
import cors from "cors";

const app = express();
const port = 4401;

app.use(cors(
  {
    origin: [
      "http://localhost:4400",
      "https://youtube-downloaders.com", "https://www.youtube-downloaders.com",
      "https://y2surf.com", "https://www.y2surf.com",
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }
));

app.use(express.json());
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey && apiKey === "youtube_downloader_key") {
    next();
  } else {
    res.status(401).json({
      hasError: true,
      message: "Unauthorized",
      videoId: "",
      title: "",
      thumbnail: "",
    });
  }
});
app.use("/api", downloadRouter);
app.use("/api/test", (req, res) => {
  res.send("Working fine");
});
app.use(errorHandler);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
