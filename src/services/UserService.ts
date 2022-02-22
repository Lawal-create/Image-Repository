import { IRepository } from "../repository/repository";
import { IUser } from "../model/userModel";
import { IImage } from "../model/imageModel";
import ApiError from "../middlewares/errorHandler/ApiError";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/responses";
import logger from "../utils/logger";
import formatLog from "../utils/logger/formatLog";
import { populateFilter } from "../utils/helpers/paginate";
import { UploadFile } from "../types/global";

class UserService {
  public readonly userRepo: IRepository<IUser>;
  public readonly imageRepo: IRepository<IImage>;

  constructor(userRepo: IRepository<IUser>, imageRepo: IRepository<IImage>) {
    this.userRepo = userRepo;
    this.imageRepo = imageRepo;
  }

  fetchUserImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info(formatLog(req, "Fetch User Images"));
      const createdBy = String(res.locals.user._id);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { date, startDate, endDate, sortBy, direction, permission } =
        req.query;
      const options: Record<string, unknown> = {};
      options.createdBy = createdBy;
      if (permission) {
        options.permission = permission;
      }

      const sortFunc = { createdAt: -1 };
      let sortValue = -1;
      if (sortBy) {
        // sort is descending by default
        const sortMethod = (direction as string) || "desc";
        if (sortMethod.toLowerCase().trim() === "asc") {
          sortValue = 1;
        }
      }
      sortFunc.createdAt = sortValue;

      const updatedFilter = populateFilter(
        date as string,
        startDate as string,
        endDate as string,
        options
      );
      const data = await this.imageRepo.findAndPaginate(
        updatedFilter,
        page,
        limit,
        sortFunc
      );

      logger.info(formatLog(req, "Successfuly Fetched User Images"));
      return successResponse(
        res,
        200,
        "Successfully Fetched User Images",
        data
      );
    } catch (err) {
      next(err);
    }
  };

  updateUserProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info(formatLog(req, "Update User Profile Image"));
      const userId = String(res.locals.user._id);
      if (!userId) {
        return next(new ApiError(400, "User not found. Please Login"));
      }
      const user = await this.userRepo.findOne({ _id: userId }, "-password");

      if (!user) {
        return next(new ApiError(404, "User not found"));
      }

      if ((req.file as Express.Multer.File).fieldname === "profileImageUrl") {
        const profileImage = req.file as Express.Multer.File;
        user.profileImageUrl = (profileImage as UploadFile).location;
      }
      const updatedUser = await user.save();
      logger.info(formatLog(req, "Successfully updated user profile photo"));
      return successResponse(
        res,
        200,
        "Successfully updated user profile photo.",
        updatedUser
      );
    } catch (err) {
      next(err);
    }
  };
}

export default UserService;
