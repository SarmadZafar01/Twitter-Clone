import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  deleteNotificataionController,
  getNotificataionController,
} from "../controllers/NotificationControllers.js";

const router = express.Router();

router.get("/", protectRoute, getNotificataionController);

router.delete("/", protectRoute, deleteNotificataionController);
// router.delete("/:id", protectRoute, deleteNotificataionControllers);

export default router;
