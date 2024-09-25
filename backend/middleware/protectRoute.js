import User from "../model/user.Model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "unauthorize: No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ error: "unauthorize: invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("error in ProtectedRoute", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};
