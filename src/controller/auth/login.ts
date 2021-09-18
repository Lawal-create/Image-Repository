import { NextFunction, Request, Response } from "express";
import { AuthResponseData } from "../../types/responses";
import ApiError from "../../middlewares/errorHandler/ApiError";
import User, { IUser } from "../../model/userModel";
import { LoginUserRequestData } from "../../types/requests";
import { checkValidity, createAccessToken } from "../../utils/helpers/auth";
import logger from "../../utils/logger";
import formatLog from "../../utils/logger/formatLog";
import { successResponse } from "../../utils/responses";
import { getBasicUserDetails } from "../../utils/helpers/auth";

const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.info(formatLog(req, "START: Login User Service"));
    const { email, password }: LoginUserRequestData = req.body;

    const user: IUser = await User.findOne({ email })
      .select("-__v +password")
      .lean();

    if (!user) return next(ApiError.badRequest("User does not exist"));

    if (!checkValidity(password, user.password))
      return next(ApiError.badRequest("Password is not correct"));

    logger.info(formatLog(req, "Checking if user is banned or deleted"));

    logger.info(formatLog(req, "END: Login User Service"));
    return successResponse<AuthResponseData>(
      res,
      200,
      "Successfully logged in user",
      { user: getBasicUserDetails(user), jwt: createAccessToken(user._id) }
    );
  } catch (err) {
    next(err);
  }
};

export default loginUser;
