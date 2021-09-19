import express, { Router } from "express";
import fetchAllUsers from "../controller/user/fetchAllUsers";
import fetchPublicImages from "../controller/user/fetchPublicImages";
import fetchSingleUser from "../controller/user/fetchSingleUser";
import fetchUserImages from "../controller/user/fetchUserImages";
import requiresSignIn from "../middlewares/auth/requiresSignIn";
import joiMiddleware from "../middlewares/joiMiddleware";
import { queryParamsValidator } from "../validators/globalSchemas";
import updateProfileImage from "../controller/user/updateProfileImages";

const userRouter: Router = express.Router();
userRouter.use(requiresSignIn);

//image routes
userRouter.get(
  "/fetch-user-images",
  joiMiddleware(queryParamsValidator),
  fetchUserImages
);

userRouter.get("/all", joiMiddleware(queryParamsValidator), fetchAllUsers);
userRouter.get(
  "/public-images",
  joiMiddleware(queryParamsValidator),
  fetchPublicImages
);
userRouter.get("/single", fetchSingleUser);

userRouter.put("/profile-image", updateProfileImage);

export default userRouter;
