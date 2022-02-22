import { IRepository } from "../repository/repository";
import { IImage } from "../model/imageModel";
import { IUser } from "../model/userModel";
import ApiError from "../middlewares/errorHandler/ApiError";
import { UploadFile } from "../types/global";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/responses";
import logger from "../utils/logger";
import formatLog from "../utils/logger/formatLog";
import getImageProperties from "../utils/imaggaApi";
import { instanceOfStringArray } from "../utils/helpers/instances";

class SearchService {
  public readonly imageRepo: IRepository<IImage>;
  public readonly userRepo: IRepository<IUser>;

  constructor(imageRepo: IRepository<IImage>, userRepo: IRepository<IUser>) {
    this.imageRepo = imageRepo;
    this.userRepo = userRepo;
  }
  searchImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info(formatLog(req, "START: Search Images By Image"));
      const arrayOfImageLinks: string[] = [];
      let imageKeys: string[] | null | undefined = [];

      if ((req.file as Express.Multer.File).fieldname === "imagesUrl") {
        const images = req.file as Express.Multer.File;
        imageKeys = await getImageProperties((images as UploadFile).location);
      }

      if (instanceOfStringArray(imageKeys)) {
        imageKeys = imageKeys.slice(0, 7);
      }
      const images = await this.imageRepo.find({
        permisssion: "public",
        keys: { $in: imageKeys as string[] }
      });

      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          arrayOfImageLinks.push(String(images[i].imagesUrl));
        }
      }

      logger.info(formatLog(req, "Successfully Searched For An Images"));
      return successResponse(
        res,
        200,
        `Successfully Fetched Images Based On The Image Uploaded`,
        arrayOfImageLinks
      );
    } catch (err) {
      next(err);
    }
  };

  searchByText = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info(formatLog(req, "START: Search Images By Text"));
      const { search } = req.query;
      const words = String(search).split(" ");
      const arrayOfImageLinks: string[] = [];
      if (!search) throw new ApiError(422, "A search query is needed");
      const images = await this.imageRepo.find({
        permisssion: "public",
        keys: { $in: words }
      });
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          arrayOfImageLinks.push(String(images[i].imagesUrl));
        }
      }
      logger.info(formatLog(req, "END: Successfully Searched For An Images"));
      return successResponse(
        res,
        200,
        `Successfully Fetched Images Based on the words: ${search}`,
        arrayOfImageLinks
      );
    } catch (err) {
      next(err);
    }
  };
}

export default SearchService;
