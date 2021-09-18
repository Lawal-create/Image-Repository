import { NextFunction, Request, Response } from "express";
import ApiError from "./errorHandler/ApiError";

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(ApiError.notFound());
};

export default notFound;
