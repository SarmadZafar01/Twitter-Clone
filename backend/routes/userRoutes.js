import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  followUnfollwUser,
  getSuggestedUser,
  getUserProfile,
  UpdateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUser);
router.post("/follow/:id", protectRoute, followUnfollwUser);
router.post("/update", protectRoute, UpdateUser);

export default router;
