import User, { IUser } from "../../model/userModel";
import ApiError from "../../middlewares/errorHandler/ApiError";
import { NextFunction } from "express";

const verifyUser = async (
  next: NextFunction,
  createdBy: string
): Promise<void | IUser> => {
  const user = await User.findById(createdBy);
  if (!user) {
    return next(new ApiError(404, "User not Found"));
  } else {
    return user;
  }
};

export default verifyUser;
