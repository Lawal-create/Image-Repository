// import Image, { IImage } from "../../model/imageModel";
// import { successResponse } from "../../utils/responses";
// import { Request, Response, NextFunction } from "express";
// import Logger from "../../utils/logger/index";
// import formatLog from "../../utils/logger/formatLog";
// import { UploadFile } from "../../types/global";
// import getImageProperties from "../../utils/imaggaApi";
// import verifyUser from "../../utils/helpers/verifyUser";
// import { instanceOfUser } from "../../utils/helpers/instances";
// import { instanceOfStringArray } from "../../utils/helpers/instances";
// import { MulterFile } from "../../types/global";

// /**
//  *
//  * @param type single | bulk
//  * @returns
//  */
// const addImages = (
//   type: "single" | "bulk"
// ): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
//   return async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const createdBy = String(res.locals.user._id);
//       const user = await verifyUser(next, createdBy);
//       const { permission } = req.body;
//       if (type === "single") {
//         Logger.info(formatLog(req, "Adding Images"));
//         const image: IImage = new Image({
//           createdBy: createdBy,
//           permission: permission
//         });
//         if ((req.file as Express.Multer.File).fieldname === "imagesUrl") {
//           const images = req.file as Express.Multer.File;
//           const location = (images as UploadFile).location;
//           image.imagesUrl = location;
//           const arrayKeys: string[] | null | undefined =
//             await getImageProperties(req, next, location);
//           if (instanceOfStringArray(arrayKeys)) {
//             image.keys = arrayKeys.slice(0, 10);
//             image.keysTagged = true;
//           }
//         }
//         await image.save();
//         if (instanceOfUser(user)) {
//           user.images.push(image._id);
//           await user.save();
//         }

//         Logger.info(formatLog(req, "END: Successfully Added Images"));
//         return successResponse(res, 200, "Successfully Added An Image", image);
//       }
//       if (type === "bulk") {
//         Logger.info(formatLog(req, "Adding Multiple Images"));
//         const imagesArray = [];
//         const arrayImageUrls: string[] = [];
//         const arrayImageKeys: string[][] = [];
//         const imageIds = [];
//         const images = (req.files as MulterFile)?.imagesUrl;
//         if (images) {
//           let keys: string[] | null | undefined = [];
//           for (let i = 0; i < images.length; i++) {
//             const image: IImage = new Image({
//               createdBy: createdBy,
//               permission: permission
//             });
//             arrayImageUrls.push((images[i] as UploadFile).location);
//             keys = await getImageProperties(
//               req,
//               next,
//               String(arrayImageUrls[i])
//             );
//             if (instanceOfStringArray(keys)) {
//               arrayImageKeys.push(keys);
//             }
//             image.keys = arrayImageKeys[i].slice(0, 10);
//             image.imagesUrl = arrayImageUrls[i];
//             image.keysTagged = true;
//             imagesArray.push(image);
//             imageIds.push(image._id);
//           }
//         }

//         const insertedImages = await Image.insertMany(imagesArray);
//         if (instanceOfUser(user)) {
//           user.images.push(...imageIds);
//           await user.save();
//         }

//         Logger.info(formatLog(req, "END: Successfully Added Multiple Images"));
//         return successResponse(
//           res,
//           200,
//           "Successfully Added Multiple Images",
//           insertedImages
//         );
//       }
//     } catch (err) {
//       next(err);
//     }
//   };
// };

// export default addImages;
