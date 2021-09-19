import express, { Router } from "express";
import addImages from "../controller/image/addImages";
import searchImageByImage from "../controller/image/searchImageByImage";
import searchImages from "../controller/image/searchImageByText";
import requiresSignIn from "../middlewares/auth/requiresSignIn";
import joiMiddleware from "../middlewares/joiMiddleware";
import upload from "../utils/aws";
import { createImageValidator } from "../validators/imageSchemas";

const imageRouter: Router = express.Router();
imageRouter.use(requiresSignIn);

//image routes
imageRouter.post(
  "/add-image",
  upload.single("imagesUrl"),
  joiMiddleware(createImageValidator),
  addImages("single")
);

imageRouter.post(
  "/add-multiple-image",
  upload.fields([{ name: "imagesUrl", maxCount: 9 }]),
  joiMiddleware(createImageValidator),
  addImages("bulk")
);

imageRouter.post(
  "/image-search",
  upload.single("imagesUrl"),
  searchImageByImage
);

imageRouter.get("/search", searchImages);
export default imageRouter;
