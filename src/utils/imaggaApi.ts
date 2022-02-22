import { NextFunction, Request } from "express";
import { imaggaApiKey, imaggaSecret } from "../config";
import logger from "../utils/logger";
import formatLog from "../utils/logger/formatLog";
import got from "got";
import ApiError from "../middlewares/errorHandler/ApiError";

const getImageProperties = async (
  imageUrl: string
): Promise<string[] | null | undefined> => {
  try {
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
    return array.slice(0, 10);
  } catch (err) {
    logger.error(err);
    throw new ApiError(500, "An Error Occurred");
  }
};

export default getImageProperties;
