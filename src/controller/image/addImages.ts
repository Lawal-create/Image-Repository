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
      if (type === "single") {
        Logger.info(formatLog(req, "Adding Images"));
        const image: IImage = new Image({
          createdBy: createdBy,
          permission: permission
        });
        if ((req.file as Express.Multer.File).fieldname === "imagesUrl") {
          const images = req.file as Express.Multer.File;
          image.imagesUrl = (images as UploadFile).location;
          image.keys = await getImageProperties(
            req,
            next,
            (images as UploadFile).location
          );
          image.keysTagged = true;
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
        const imagesArray = [];
        const arrayImageUrls: string[] = [];
        const arrayImageKeys: string[][] = [];
        const imageIds = [];
        const images = (req.files as MulterFile)?.imagesUrl;
        if (images) {
          let keys: string[] | null | undefined = [];
          for (let i = 0; i < images.length; i++) {
            const image: IImage = new Image({
              createdBy: createdBy,
              permission: permission
            });
            arrayImageUrls.push((images[i] as UploadFile).location);
            keys = await getImageProperties(
              req,
              next,
              String(arrayImageUrls[i])
            );
            if (instanceOfStringArray(keys)) {
              arrayImageKeys.push(keys);
            }
            image.keys = arrayImageKeys[i];
            image.imagesUrl = arrayImageUrls[i];
            imagesArray.push(image);
            imageIds.push(image._id);
          }
        }

        const insertedImages = await Image.insertMany(imagesArray);
        if (instanceOfUser(user)) {
          user.images.push(...imageIds);
          await user.save();
        }

        Logger.info(formatLog(req, "END: Successfully Added Multiple Images"));
        return successResponse(
          res,
          200,
          "Successfully Added Multiple Images",
          insertedImages
        );
      }
    } catch (err) {
      next(err);
    }
  };
};

export default addImages;
