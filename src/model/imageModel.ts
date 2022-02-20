import { Document, Model, model, Types, Schema } from "mongoose";
import { TimeStamps, permission } from "../types/global";
import getTypeAndDefaultValue from "../utils/helpers/getTypeAndDefaultValue";

export interface IImage extends Document, TimeStamps {
  imagesUrl: string;
  keys: string[] | string[][] | null | undefined;
  permisssion: "public" | "private";
  createdBy: Types.ObjectId;
  keysTagged: boolean;
}

const ImageSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

const Image: Model<IImage> = model("Image", ImageSchema);

export default Image;
