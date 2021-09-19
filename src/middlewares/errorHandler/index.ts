import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { MongoError } from "mongodb";
import { Error as MongooseError } from "mongoose";
import { AxiosError } from "axios";
import { deleteSingleFile, deleteMultipleFiles } from "../../utils/aws";
import logger from "../../utils/logger";
import { errorResponse } from "../../utils/responses";
import ApiError from "./ApiError";
import { nodeEnv } from "../../config";
import { JsonWebTokenError } from "jsonwebtoken";
import { UploadFile } from "../../types/global";

const errorHandler = (
  err: ErrorRequestHandler | MongoError | AxiosError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let message = "Oops, something went wrong. Please try again later";
  let errCode = 500;

  if (err instanceof ApiError) {
    message = err.message;
    errCode = err.code;
  } else if (err instanceof MongooseError.CastError) {
    //handle mongoose cast error
    message = `Invalid ${err.path}: ${err.value}.`;
    errCode = 400;
  } else if (err instanceof MongooseError.ValidationError) {
    //handle mongoose field validation error
    const errors: string[] = Object.values(err.errors).map(
      (
        error:
          | MongooseError.CastError
          | MongooseError.ValidationError
          | MongooseError.ValidatorError
      ) => error.message
    );

    message = `Invalid input data. ${errors.join(". ")}`;
    errCode = 400;
  } else if ((err as MongoError).code === 11000) {
    //handle mongoose duplicate field errors
    const value: string =
      (err as MongoError).errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || "";

    message = `Duplicate field value: ${value}. Please use another value!`;
    errCode = 400;
  } else if ((err as AxiosError).isAxiosError) {
    //handle axios errors
    if ((err as AxiosError).response)
      message =
        (err as AxiosError).response?.data.error ||
        (err as AxiosError).response?.data.message;
    else message = (err as AxiosError).message;

    errCode = (err as AxiosError).response?.status || 500;
  } else if (err instanceof JsonWebTokenError) {
    //handle jwt errors
    message = err.message;
    errCode = 403;
  } else if (err instanceof Error) {
    //handle multer errors
    message = err.message;
    errCode = 422;
  } else if (
    err instanceof SyntaxError ||
    err instanceof EvalError ||
    err instanceof RangeError ||
    err instanceof ReferenceError ||
    err instanceof TypeError ||
    err instanceof URIError
  ) {
    //handle global error types
    message = err.message;
    errCode = 400;
  }

  logger.error(
    `[${req.method} ${req.url}] ${
      //convert other data types to strings to ensure readability in logs
      typeof message === "string" ? message : JSON.stringify(message)
    }`
  );
  if (nodeEnv !== "test") console.error(err);

  // delete any uploaded file
  if (req.file) deleteSingleFile(req, (req.file as UploadFile).key);
  else if (req.files) {
    const filepaths = [];
    //flatten all file objects to be in a single array
    const files = [].concat(...Object.values(req.files));

    if (files.length) {
      for (const file of files) {
        filepaths.push({ Key: (file as UploadFile).key });
      }
      deleteMultipleFiles(req, filepaths);
    }
  }

  errorResponse(res, errCode, message);
};

export default errorHandler;
