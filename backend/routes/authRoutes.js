import express from "express";

import {
  getME,
  Login,
  Logout,
  Signup,
} from "../controllers/auth.Controllers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", Signup);

router.post("/login", Login);
router.post("/logout", Logout);

router.get("/GETME", protectRoute, getME);

export default router;
