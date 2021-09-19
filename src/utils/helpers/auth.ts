import bcrypt from "bcryptjs";
import crypto from "crypto";
import User, { IUser } from "../../model/userModel";
import { CookieOptions, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TimeStamps } from "../../types/global";
import {
  jwtExpiresIn,
  jwtSecret,
  refreshTokenExpiresIn,
  bcryptSalt
} from "../../config";

export const generateHashedValue = (value: string): string => {
  return bcrypt.hashSync(value, bcryptSalt);
};

export const checkValidity = (value: string, compareValue: string): boolean => {
  return bcrypt.compareSync(value, compareValue);
};

//to check if a given field value already exists in db
export const checkExisting = async (
  field: string,
  value: string
): Promise<boolean> => {
  const existingUser = await User.findOne({ [field]: value });

  return existingUser ? true : false;
};

export interface IJWToken {
  token: string;
  expiresAt: number;
}

export const createAccessToken = (id: string): IJWToken => {
  const token: string = jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpiresIn
  });

  const expiresAt: number =
    (jwt.verify(token, jwtSecret) as JwtPayload).exp || Date.now();

  return { token, expiresAt };
};

export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  // create httponly cookie with refresh token that expires in x amount of days
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + refreshTokenExpiresIn * 24 * 60 * 60 * 1000),
    sameSite: "none",
    secure: true
  };

  res.cookie("refreshToken", token, cookieOptions);
};

export const generateAvatarUrl = (name: string): string => {
  return `https://ui-avatars.com/api?name=${name}`;
};

// export const userBasicPaths =
//   "name companyName email role profileImageUrl phoneNumber verified phoneVerified oneSignalId";

export interface IBasicUser extends TimeStamps {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string;
}

export const getBasicUserDetails = (user: IUser): IBasicUser => {
  const {
    _id,
    firstName,
    lastName,
    profileImageUrl,
    email,
    createdAt,
    updatedAt
  } = user;

  return {
    _id,
    firstName,
    lastName,
    profileImageUrl,
    email,
    createdAt,
    updatedAt
  };
};
