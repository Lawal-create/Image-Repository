import { successResponse } from "../../utils/responses";
import { Request, Response, NextFunction } from "express";
import Logger from "../../utils/logger/index";
import formatLog from "../../utils/logger/formatLog";
import verifyUser from "../../utils/helpers/verifyUser";
import { instanceOfUser } from "../../utils/helpers/instances";

const fetchSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    Logger.info(formatLog(req, "START: Fetching A Single User"));
    const { userId } = req.params;
    const user = await verifyUser(next, userId);
    if (instanceOfUser(user)) {
      Logger.info(formatLog(req, "END: Successfully Fetched A Single User"));
      return successResponse(
        res,
        200,
        "Successfully Fetched A Single User",
        user
      );
    }
  } catch (err) {
    next(err);
  }
};

export default fetchSingleUser;
