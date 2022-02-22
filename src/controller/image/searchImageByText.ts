import Image from "../../model/imageModel";
import { successResponse } from "../../utils/responses";
import { Request, Response, NextFunction } from "express";
import Logger from "../../utils/logger/index";
import formatLog from "../../utils/logger/formatLog";

//Locate Image Links
export const locateImage = async (
  req: Request,
  res: Response,
  value: string[],
  arrayOfImageLinks: string[]
): Promise<void> => {
  const images = await Image.find({
    permisssion: "public",
    keys: { $in: value }
  });
  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      arrayOfImageLinks.push(String(images[i].imagesUrl));
    }
  }
  Logger.info(formatLog(req, "Successfully Searched For An Images"));
  return successResponse(
    res,
    200,
    `Successfully Fetched Images Based on the word ${value}`,
    arrayOfImageLinks
  );
};

const searchImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    Logger.info(formatLog(req, "Searching All Images"));
    const { search } = req.query;
    const words = String(search).split(" ");
    const arrayOfImageLinks: string[] = [];
    if (search) {
      await locateImage(req, res, words, arrayOfImageLinks);
    }
  } catch (err) {
    next(err);
  }
};

export default searchImages;
