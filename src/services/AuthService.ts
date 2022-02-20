import { IRepository } from "../repository/repository";
import { IUser } from "../model/userModel";
import ApiError from "../middlewares/errorHandler/ApiError";
import bcrypt from "bcryptjs";
import { createAccessToken, generateHashedValue } from "../utils/helpers/auth";
import { UploadFile } from "../types/global";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/responses";
import logger from "../utils/logger";
import formatLog from "../utils/logger/formatLog";
import { getBasicUserDetails, IBasicUser } from "../utils/helpers/auth";

class AuthService {
  public readonly userRepository: IRepository<IUser>;

  constructor(userRepository: IRepository<IUser>) {
    this.userRepository = userRepository;
  }

  loginLogic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ token: string } | void> => {
    try {
      logger.info(formatLog(req, "START: Logging in a user"));
      const { email, password } = req.body;
      const user: IUser | null = await this.userRepository.findOne(
        {
          email: email
        },
        "+password"
      );
      if (!user) {
        throw new ApiError(404, "User not found");
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new ApiError(400, "Invalid Email or Password");
      }

      const { token } = await createAccessToken(user.id);
      logger.info(formatLog(req, "END: Successfully Logged In A User"));
      return successResponse(res, 200, "Successfully logged in a user", {
        accessToken: token
      });
    } catch (err) {
      next(err);
    }
  };

  signupLogic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | IUser> => {
    try {
      logger.info(formatLog(req, "START: Registering A User Details"));
      const { email, firstName, lastName, password } = req.body;
      const profileImageUrl = req.file
        ? (req.file as UploadFile).location
        : `https://ui-avatars.com/api?name=${firstName}-${lastName}`;
      const prevUser = await this.userRepository.find({ email: email });
      if (prevUser.length > 0)
        throw new ApiError(400, "User with this email already exists");
      const user = await this.userRepository.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        profileImageUrl: profileImageUrl,
        password: generateHashedValue(password)
      } as IUser);
      logger.info(
        formatLog(req, "END: Successfully Registered A User Details")
      );
      return successResponse<IBasicUser>(
        res,
        200,
        "Succesfully Regsitered a User",
        getBasicUserDetails(user as IUser)
      );
    } catch (err) {
      next(err);
    }
  };
}

export default AuthService;
