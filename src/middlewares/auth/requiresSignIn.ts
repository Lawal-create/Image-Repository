import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtSecret } from "../../config";
import User, { IUser } from "../../model/userModel";
import { JWTData } from "../../types/global";
import ApiError from "../errorHandler/ApiError";

const requiresSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader: string = req.headers["authorization"] || "";
    if (!authHeader) {
      //continue if participant id is used for auth
      if (req.body.participantId) return next();

      return next(new ApiError(401, "No token provided"));
    }

    const token: string = authHeader.replace("Bearer ", "");

    //verify JWT
    const decoded: string | JwtPayload = jwt.verify(token, jwtSecret);
    const userId = (decoded as JWTData).id;

    if (!userId) return next(new ApiError(403, "Invalid token provided"));

    //save userid in request body for use in routes
    req.body.userId = userId;

    //save user object in body if user isn't banned/deleted
    const user = await checkForUser(userId, next);
    req.body.user = user;
    res.locals.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

const checkForUser = async (
  userId: string,
  next: NextFunction
): Promise<void | IUser> => {
  try {
    const user: IUser = await User.findById(userId).select("+password").lean();

    if (!user) return next(ApiError.badRequest("User not found"));

    return user;
  } catch (err) {
    next(err);
  }
};

export default requiresSignIn;
