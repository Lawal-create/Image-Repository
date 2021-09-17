import { Document, Model, model, Types, Schema } from "mongoose";
import { TimeStamps } from "../types/global";
import getTypeAndDefaultValue from "../utils/helpers/getTypeAndDefaultValue";

export interface IUser extends Document, TimeStamps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImageUrl: string;
  images: Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "User's First name is required"]
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "User's First name is required"]
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Email address is required"]
    },
    password: {
      type: String,
      select: false
    },
    profileImageUrl: getTypeAndDefaultValue(
      String,
      "https://ui-avatars.com/api/?firstName=New+User"
    ),
    images: {
      type: Schema.Types.ObjectId,
      ref: "Image"
    }
  },
  { timestamps: true }
);

const User: Model<IUser> = model("User", UserSchema);

export default User;
