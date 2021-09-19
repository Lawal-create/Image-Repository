import User from "../../model/userModel";
import ApiError from "../../middlewares/errorHandler/ApiError";
import { successResponse } from "../../utils/responses";
import { Request, Response, NextFunction } from "express";
import Logger from "../../utils/logger/index";
import formatLog from "../../utils/logger/formatLog";
import { UploadFile } from "../../types/global";
import { getBasicUserDetails } from "../../utils/helpers/auth";

const updateProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  Logger.info(formatLog(req, "Update user profile image"));
  const userId = String(res.locals.user._id);
  if (!userId) {
    return next(new ApiError(400, "User not found. Please Login"));
  }
  const user = await User.findOne({ _id: userId }).select("-password");

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  if ((req.file as Express.Multer.File).fieldname === "profileImageUrl") {
    const profileImage = req.file as Express.Multer.File;
    user.profileImageUrl = (profileImage as UploadFile).location;
  }
  const updatedUser = await user.save();
  Logger.info(formatLog(req, "Successfully updated user profile photo"));
  return successResponse(res, 200, "Successfully updated user profile photo.", {
    user: getBasicUserDetails(updatedUser)
  });
};
export default updateProfileImage;
