import express, { Router } from "express";
import { authService } from "../di/serviceLocator";
import joiMiddleware from "../middlewares/joiMiddleware";
import upload from "../utils/aws";
import { signupValidator, loginValidator } from "../validators/authSchemas";

const authRouter: Router = express.Router();
authRouter.post(
  "/login",
  joiMiddleware(loginValidator),
  authService.loginLogic
);

authRouter.post(
  "/signup",
  upload.single("profileImageUrl"),
  joiMiddleware(signupValidator),
  authService.signupLogic
);

export default authRouter;
