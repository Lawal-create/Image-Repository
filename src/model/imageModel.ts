import { Document, Model, model, Types, Schema } from "mongoose";
import { TimeStamps, permission } from "../types/global";

export interface IImage extends Document, TimeStamps {
  imageUrl: string;
  title: string;
  permisssion: "public" | "private";
  createdBy: Types.ObjectId;
}

const ImageSchema: Schema = new Schema({
  imageUrl: {
    type: String,
    required: [true, "Image Url is required"]
  },
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  permission: {
    type: String,
    enum: permission,
    required: [true, "Permission is required"]
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Image: Model<IImage> = model("Image", ImageSchema);

export default Image;
