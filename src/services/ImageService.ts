import { IRepository } from "../repository/repository";
import Image, { IImage } from "../model/imageModel";
import { IUser } from "../model/userModel";
import ApiError from "../middlewares/errorHandler/ApiError";
import { UploadFile } from "../types/global";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/responses";
import logger from "../utils/logger";
import formatLog from "../utils/logger/formatLog";
import { MulterFile } from "../types/global";

class ImageService {
  public readonly imageRepo: IRepository<IImage>;
  public readonly userRepo: IRepository<IUser>;

  constructor(imageRepo: IRepository<IImage>, userRepo: IRepository<IUser>) {
    this.imageRepo = imageRepo;
    this.userRepo = userRepo;
  }
  addSingleImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info(formatLog(req, "Adding A Single Image"));
      const createdBy = String(res.locals.user._id);
      const user = await this.userRepo.findById(createdBy);

      if (!user) throw new ApiError(400, "User not found");
      const { permission } = req.body;
      let imagesUrl = "";

      if ((req.file as Express.Multer.File).fieldname === "imagesUrl") {
        const images = req.file as Express.Multer.File;
        const location = (images as UploadFile).location;
        imagesUrl = location;
      }

      const image = await this.imageRepo.create({
        createdBy: createdBy,
        permisssion: permission,
        imagesUrl: imagesUrl
      } as IImage);

      user.images.push((image as IImage)._id);
      user.save();

      logger.info(formatLog(req, "Successfully Added A Single Image"));
      return successResponse(
        res,
        200,
        "Successfully Uploaded A Single Image",
        image
      );
    } catch (err) {
      next(err);
    }
  };

  addMultipleImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info(formatLog(req, "Adding Multiple Images "));
      const imagesArray: IImage[] = [];
      const imageIds = [];

      const images = (req.files as MulterFile)?.imagesUrl;
      const createdBy = String(res.locals.user._id);

      const user = await this.userRepo.findById(createdBy);
      if (!user) throw new ApiError(400, "User not found");

      const { permission } = req.body;

      if (images) {
        for (let i = 0; i < images.length; i++) {
          const image = new Image({
            createdBy: createdBy,
            permission: permission
          });

          const location = (images[i] as UploadFile).location;
          image.imagesUrl = location;
          imagesArray.push(image);
          imageIds.push(image._id);
        }
      }

      const data = await this.imageRepo.createMany(imagesArray);
      user.images.push(...imageIds);
      user.save();
      logger.info(formatLog(req, "Successfully Added Multiple Images "));
      return successResponse(
        res,
        200,
        "Successfully Uploaded Multiple Images",
        data
      );
    } catch (err) {
      next(err);
    }
  };
}

export default ImageService;
