import { NextFunction, Request } from "express";
import { imaggaApiKey, imaggaSecret } from "../config";
import logger from "../utils/logger";
import formatLog from "../utils/logger/formatLog";
import got from "got";

const getImageProperties = async (
  req: Request,
  next: NextFunction,
  imageUrl: string
): Promise<string[] | null | undefined> => {
  try {
    logger.info(formatLog(req, "Storing the properties of the Image"));
    const apiKey = imaggaApiKey;
    const apiSecret = imaggaSecret;
    const url =
      "https://api.imagga.com/v2/tags?image_url=" +
      encodeURIComponent(imageUrl);

    const response = await got(url, {
      username: apiKey,
      password: apiSecret
    });

    const responses = JSON.parse(response.body);
    const array: string[] = [];
    for (let i = 0; i < responses.result.tags.length; i++) {
      array.push(String(responses.result.tags[i].tag.en));
    }
    logger.info(formatLog(req, "Successfully stored the image properties"));
    return array;
  } catch (err) {
    next(err);
  }
};

export default getImageProperties;
