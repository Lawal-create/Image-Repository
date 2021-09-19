import express, { Router } from "express";
import addImages from "../controller/image/addImages";
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
  upload.fields([{ name: "imagesUrl", maxCount: 10 }]),
  joiMiddleware(createImageValidator),
  addImages("bulk")
);

export default imageRouter;
