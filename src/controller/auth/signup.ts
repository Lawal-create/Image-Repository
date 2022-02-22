// import { NextFunction, Request, Response } from "express";
// import { IUser } from "../../model/userModel";
// import { UploadFile } from "../../types/global";
// import logger from "../../utils/logger";
// import formatLog from "../../utils/logger/formatLog";
// import { successResponse } from "../../utils/responses";
// import { getBasicUserDetails, IBasicUser } from "../../utils/helpers/auth";
// import AuthService from "../../services/AuthService";

// //Sign Up a User
// const signupUser = (authService: AuthService) => {
//   return async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       logger.info(formatLog(req, "START: Registering A User Details"));
//       const { email, firstName, lastName, password } = req.body;
//       const profileImageUrl = req.file
//         ? (req.file as UploadFile).location
//         : `https://ui-avatars.com/api?name=${firstName}-${lastName}`;
//       const user = await authService.signupLogic(
//         firstName,
//         lastName,
//         email,
//         password,
//         profileImageUrl
//       );
//       logger.info(
//         formatLog(req, "END: Successfully Registered A User Details")
//       );
//       return successResponse<IBasicUser>(
//         res,
//         200,
//         "Succesfully Regsitered a User",
//         getBasicUserDetails(user as IUser)
//       );
//     } catch (err) {
//       next(err);
//     }
//   };
// };

// export default signupUser;
