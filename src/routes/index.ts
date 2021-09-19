import express, { Router } from "express";
import authRoutes from "./auth";
import imageRoutes from "./image";
import userRoutes from "./user";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/image", imageRoutes);
router.use("/user", userRoutes);

export default router;
