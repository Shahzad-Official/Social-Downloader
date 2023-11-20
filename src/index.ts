import express from 'express';
import downloadRouter from './routes/downloadRoutes';
import errorHandler from './errorHandler';
const app = express();
const port = 3000;

app.use(express.json());
app.use("/download",downloadRouter);

app.get('/', (req, res) => res.send('Hello World!'));
app.use(errorHandler);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))