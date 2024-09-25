import Notification from "../model/NotificationModel.js";
import User from "../model/user.Model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudianry } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in Get  User Profile", error.message);
  }
};

export const followUnfollwUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user.id.toString()) {
      return res
        .status(400)
        .json({ message: "You cant follow/Unfollow yourself" });
    }

    if (!userToModify || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      //   const newnotification = new Notification({
      //     type: "follow",
      //     from: req.user._id,
      //     to: userToModify._id,
      //   });

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newnotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newnotification.save();

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in followunFollowuser", error.message);
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const userFollowedbyme = await User.findOne(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteruser = users.filter(
      (user) => !userFollowedbyme.following.includes(user._id)
    );
    const suggestedUser = filteruser.slice(0, 4);

    suggestedUser.forEach((user) => (user.password = null));
    res.status(200).json({ suggestedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getSuggestedUser", error.message);
  }
};

export const UpdateUser = async (req, res) => {
  const { fullName, email, username, currentPassword, NewPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (
      (!currentPassword && currentPassword) ||
      (!currentPassword && NewPassword)
    ) {
      return res
        .status(401)
        .json({ message: "please provide both current and new password" });
    }

    if (currentPassword && NewPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid current password" });
      }
      if (NewPassword.length < 6) {
        return res
          .status(401)
          .json({ message: "Password must be at least 6 characters" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(NewPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudianry.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudianry.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudianry.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudianry.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in updateUser", error.message);
  }
};
