import express, { Router } from "express";
import authRoutes from "./auth";
import imageRoutes from "./image";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/image", imageRoutes);

export default router;
