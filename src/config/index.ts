import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT;
export const nodeEnv = process.env.NODE_ENV;
export const mongoURI = process.env.MONGO_URI || "";
export const jwtSecret = process.env.JWT_SECRET || "";
export const jwtExpiresIn = Number(process.env.JWT_EXPIRES_IN) || "";
export const bcryptSalt = Number(process.env.BCRYPT_SALT) || "";
export const refreshTokenExpiresIn =
  Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || 0;
export const resetTokenExpiresIn =
  Number(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN) || 0;
