import express from "express";
import { port } from "./config/index";
import logger from "./utils/logger";
import connectToDB from "./database/connect";
import router from "./routes";
import errorHandler from "./middlewares/errorHandler";
import notFound from "./middlewares/notFound";
import cookieParser from "cookie-parser";

const app = express();

connectToDB();
app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1", router);

app.use("*", notFound);

app.use(errorHandler);

const server = app.listen(port, () => {
  logger.info(`
  ###########################################
  Server is currently running at port ${port}
  ###########################################`);
});

export default server;
