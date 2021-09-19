import express, { Router } from "express";
import fetchUserImages from "../controller/user/fetchUserImages";
import requiresSignIn from "../middlewares/auth/requiresSignIn";
import joiMiddleware from "../middlewares/joiMiddleware";

const userRouter: Router = express.Router();
userRouter.use(requiresSignIn);

//image routes
userRouter.get("/fetch-user-images", fetchUserImages);

export default userRouter;
