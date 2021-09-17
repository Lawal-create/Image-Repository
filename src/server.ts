import express from "express";
import { port } from "./config/index";
import logger from "./utils/logger";
import connectToDB from "./database/connect";

const app = express();

connectToDB();

const server = app.listen(port, () => {
  logger.info(`
  ###########################################
  Server is currently running at port ${port}
  ###########################################`);
});

export default server;
