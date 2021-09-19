import { successResponse } from "../../utils/responses";
import { Request, Response, NextFunction } from "express";
import Logger from "../../utils/logger/index";
import formatLog from "../../utils/logger/formatLog";
import User from "../../model/userModel";
import {
  fetchMongoDBPaginatedData,
  populateFilter
} from "../../utils/helpers/paginate";

const fetchAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    Logger.info(formatLog(req, "Fetching Users"));
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { date, startDate, endDate, sortBy, direction } = req.query;
    const options: Record<string, unknown> = {};

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
    const paginatedResponse = await fetchMongoDBPaginatedData(
      User,
      page,
      limit,
      updatedFilter,
      undefined,
      sortFunc
    );

    Logger.info(formatLog(req, "Successfuly Fetched All Users"));
    return successResponse(
      res,
      200,
      "Successfully Fetched All Users",
      paginatedResponse
    );
  } catch (err) {
    next(err);
  }
};

export default fetchAllUsers;
