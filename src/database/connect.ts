import mongoose, { ConnectOptions } from "mongoose";
import { mongoURI } from "../config";
import logger from "../utils/logger";

const connectToDB = async (): Promise<void> => {
  try {
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions);

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error"));
    db.once("open", () => {
      logger.info("Database connected successfully!");
    });
  } catch (err) {
    console.error(err);
  }
};

export default connectToDB;
