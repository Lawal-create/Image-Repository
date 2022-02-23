import express, { Router } from "express";
import requiresSignIn from "../middlewares/auth/requiresSignIn";
import joiMiddleware from "../middlewares/joiMiddleware";
import { queryParamsValidator } from "../validators/globalSchemas";
import upload from "../utils/aws";
import { userService } from "../di/serviceLocator";

const userRouter: Router = express.Router();
userRouter.use(requiresSignIn);

//user routes
userRouter.get(
  "/fetch-user-images",
  joiMiddleware(queryParamsValidator, "query"),
  userService.fetchUserImages
);

userRouter.put(
  "/profile-image",
  upload.single("profileImageUrl"),
  userService.updateUserProfileImage
);

export default userRouter;
