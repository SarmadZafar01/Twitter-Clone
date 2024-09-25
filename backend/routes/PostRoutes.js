import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  getFollowingPost,
  getLikedPosts,
  getPost,
  getUserPosts,
  likeUblikePost,
} from "../controllers/postControllers.js";

const router = express.Router();

router.get("/all", protectRoute, getPost);
router.get("/following", protectRoute, getFollowingPost);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUblikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
