import * as cron from "node-cron";
import { FilterQuery, UpdateQuery, Model } from "mongoose";
import { cronJobSchedule } from "./config";
import Image, { IImage } from "./model/imageModel";
import logger from "./utils/logger";
import Repository, { IRepository } from "./repository/repository";
import getImageProperties from "./utils/imaggaApi";

const cronJobs = async (imageRepo: IRepository<IImage>): Promise<void> => {
  const addKeyTags = cron.schedule(cronJobSchedule, async () => {
    logger.info("Adding Key Tags for images uplaoded");

    const untaggedImages: IImage[] = await imageRepo.find({
      keysTagged: false,
      permisssion: "public"
    });
    const imageLen = untaggedImages.length;
    if (imageLen > 0) {
      for (let i = 0; i < imageLen; i++) {
        const imageKeys = await getImageProperties(untaggedImages[i].imagesUrl);
        untaggedImages[i].keys = imageKeys;
        untaggedImages[i].keysTagged = true;
        await untaggedImages[i].save();
      }
      logger.info("Successfully Added Key Tags to various Images");
    }
  });
  addKeyTags.start();
};

export default cronJobs;
