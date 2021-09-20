import express, { Router } from "express";
import fetchPublicImages from "../controller/user/fetchPublicImages";
import fetchSingleUser from "../controller/user/fetchSingleUser";
import fetchUserImages from "../controller/user/fetchUserImages";
import requiresSignIn from "../middlewares/auth/requiresSignIn";
import joiMiddleware from "../middlewares/joiMiddleware";
import {
  queryParamsValidator,
  userQueryParamsValidator
} from "../validators/globalSchemas";
import updateProfileImage from "../controller/user/updateProfileImages";
import upload from "../utils/aws";

const userRouter: Router = express.Router();
userRouter.use(requiresSignIn);

//image routes
userRouter.get(
  "/fetch-user-images",
  joiMiddleware(queryParamsValidator, "query"),
  fetchUserImages
);

userRouter.get(
  "/public-images",
  joiMiddleware(queryParamsValidator, "query"),
  fetchPublicImages
);
userRouter.get(
  "/single",
  joiMiddleware(userQueryParamsValidator, "query"),
  fetchSingleUser
);

userRouter.put(
  "/profile-image",
  upload.single("profileImageUrl"),
  updateProfileImage
);

export default userRouter;
