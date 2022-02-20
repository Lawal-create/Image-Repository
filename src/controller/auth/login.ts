// import { NextFunction, Request, Response } from "express";
// import AuthService from "../../services/AuthService";

// //Login a User
// const loginUser = (authService: AuthService) => {
//   return async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const { email, password } = req.body;
//       const accessToken = await authService.loginLogic(email, password);
//       return successResponse(res, 200, "Successfully logged in a user", {
//         accessToken: accessToken
//       });
//     } catch (err) {
//       next(err);
//     }
//   };
// };
// export default loginUser;
