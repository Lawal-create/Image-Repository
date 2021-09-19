import { JwtPayload } from "jsonwebtoken";
import { PopulateOptions } from "mongoose";
export interface TimeStamps {
  createdAt: Date;
  updatedAt: Date;
}
export interface JWTData extends JwtPayload {
  id: string;
}

export type populate = string | PopulateOptions | PopulateOptions[];

export const permission = ["public", "private"];

export interface MulterFile {
  [fieldname: string]: Express.Multer.File[];
}

export interface UploadFile extends Express.Multer.File {
  location: string;
  key: string;
}
