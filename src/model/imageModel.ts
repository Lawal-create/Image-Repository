import { Document, Model, model, Types, Schema } from "mongoose";
import { TimeStamps, permission } from "../types/global";

export interface IImage extends Document, TimeStamps {
  imagesUrl: string | string[];
  keys: string[] | string[][] | null | undefined;
  permisssion: "public" | "private";
  createdBy: Types.ObjectId;
}

const ImageSchema: Schema = new Schema({
  imagesUrl: Schema.Types.Mixed,
  permission: {
    type: String,
    enum: permission,
    required: [true, "Permission is required"]
  },
  keys: [
    {
      type: Schema.Types.Mixed
    }
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Image: Model<IImage> = model("Image", ImageSchema);

export default Image;
