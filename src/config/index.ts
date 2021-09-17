import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT;
export const nodeEnv = process.env.NODE_ENV;
export const mongoURI = process.env.MONGO_URI || "";
