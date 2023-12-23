import express from "express";
import downloadRouter from "./routes/downloadRoutes";
import errorHandler from "./errorHandler";
const app = express();
const port = 4401;
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey && apiKey === "your-api-key") {
    next();
  } else {
    res.status(401).json({
      hasError: true,
      message:"Unauthorized",
      videoId: "",
      title: "",
      thumbnail: "",
    });
  }
});

app.use(express.json());
app.use("/api", downloadRouter);
app.use("/api/test", (req, res) => {
  res.send("Working fine");
});
app.use(errorHandler);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
