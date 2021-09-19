import Image, { IImage } from "../../model/imageModel";
import { successResponse } from "../../utils/responses";
import { Request, Response, NextFunction } from "express";
import Logger from "../../utils/logger/index";
import formatLog from "../../utils/logger/formatLog";
import { UploadFile } from "../../types/global";
import getImageProperties from "../../utils/imaggaApi";
import verifyUser from "../../utils/helpers/verifyUser";
import { instanceOfUser } from "../../utils/helpers/instances";
import { instanceOfStringArray } from "../../utils/helpers/instances";

const addImages = (
  type: "single" | "bulk"
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const createdBy = String(res.locals.user._id);
      const user = await verifyUser(next, createdBy);
      const { permission } = req.body;
      const image: IImage = new Image({
        createdBy: createdBy,
        permission: permission
      });
      if (type === "single") {
        Logger.info(formatLog(req, "Adding Images"));
        if ((req.file as Express.Multer.File).fieldname === "imagesUrl") {
          const images = req.file as Express.Multer.File;
          image.imagesUrl = (images as UploadFile).location;
          image.keys = await getImageProperties(
            req,
            next,
            (images as UploadFile).location
          );
        }
        await image.save();
        if (instanceOfUser(user)) {
          user.images.push(image._id);
          await user.save();
        }

        Logger.info(formatLog(req, "END: Successfully Added Images"));
        return successResponse(res, 200, "Successfully Added An Image", image);
      }
      if (type === "bulk") {
        Logger.info(formatLog(req, "Adding Multiple Images"));
        type MulterFile = { [fieldname: string]: Express.Multer.File[] };
        const arrayImageUrls: string[] = [];
        const arrayImageKeys: string[][] = [];
        const images = (req.files as MulterFile)?.imagesUrl;
        if (images) {
          for (let i = 0; i < images.length; i++) {
            arrayImageUrls.push((images[i] as UploadFile).location);
          }
          let keys: string[] | null | undefined = [];
          image.imagesUrl = arrayImageUrls;
          for (let i = 0; i < image.imagesUrl.length; i++) {
            keys = await getImageProperties(
              req,
              next,
              String(image.imagesUrl[i])
            );

            if (instanceOfStringArray(keys)) {
              arrayImageKeys.push(keys);
            }
          }
          image.keys = arrayImageKeys;
        }

        await image.save();
        if (instanceOfUser(user)) {
          user.images.push(image._id);
          await user.save();
        }

        Logger.info(formatLog(req, "END: Successfully Added Multiple Images"));
        return successResponse(
          res,
          200,
          "Successfully Added Multiple Images",
          image
        );
      }
    } catch (err) {
      next(err);
    }
  };
};

export default addImages;
