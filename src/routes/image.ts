import express, { Router } from "express";
import requiresSignIn from "../middlewares/auth/requiresSignIn";
import joiMiddleware from "../middlewares/joiMiddleware";
import upload from "../utils/aws";
import { createImageValidator } from "../validators/imageSchemas";
import { imageService, searchService } from "../di/serviceLocator";

const imageRouter: Router = express.Router();

imageRouter.use(requiresSignIn);

imageRouter.post(
  "/add-image",
  upload.single("imagesUrl"),
  joiMiddleware(createImageValidator),
  imageService.addSingleImage
);

imageRouter.post(
  "/add-multiple-image",
  upload.fields([{ name: "imagesUrl", maxCount: 9 }]),
  joiMiddleware(createImageValidator),
  imageService.addMultipleImages
);

imageRouter.post(
  "/image-search",
  upload.single("imagesUrl"),
  searchService.searchImages
);

imageRouter.get("/text-search", searchService.searchByText);
export default imageRouter;
