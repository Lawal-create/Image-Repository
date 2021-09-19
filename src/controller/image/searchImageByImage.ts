import { Request, Response, NextFunction } from "express";
import Logger from "../../utils/logger/index";
import formatLog from "../../utils/logger/formatLog";
import { UploadFile } from "../../types/global";
import getImageProperties from "../../utils/imaggaApi";
import { locateImage } from "./searchImageByText";
import { instanceOfStringArray } from "../../utils/helpers/instances";

const searchImageByImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    Logger.info(formatLog(req, "Search Images By Image"));
    Logger.info(formatLog(req, "Adding Images"));
    const arrayOfImageLinks: string[] = [];
    if ((req.file as Express.Multer.File).fieldname === "imagesUrl") {
      const images = req.file as Express.Multer.File;
      const imageKeys = await getImageProperties(
        req,
        next,
        (images as UploadFile).location
      );

      if (instanceOfStringArray(imageKeys)) {
        const searchKeys = imageKeys.splice(0, 7);
        await locateImage(req, res, searchKeys, arrayOfImageLinks);
      }
    }

    Logger.info(formatLog(req, "END: Successfully Added Images"));
    // return successResponse(res, 200, "Successfully Added An Image", image);
  } catch (err) {
    next(err);
  }
};

export default searchImageByImage;
