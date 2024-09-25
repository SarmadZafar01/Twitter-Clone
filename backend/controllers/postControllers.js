import Post from "../model/postModel.js";
import Notification from "../model/NotificationModel.js";

import User from "../model/user.Model.js";
import { v2 as cloudianry } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!text && !img) {
      return res.status(400).json({ message: "Please enter text or image" });
    }

    if (img) {
      const uploadedResponse = await cloudianry.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in createPost", error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You can't delete this post" });

    if (post.img) {
      const imageId = post.img.split("/").pop().split(".")[0];
      await cloudianry.uploader.destroy(imageId);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in Delete-Post", error.message);
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ message: "Text Field Required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in Comment-Post", error.message);
  }
};

export const likeUblikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const userLikepost = post.likes.includes(userId);

    if (userLikepost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      return res.status(200).json(updatedLikes);
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();
    }

    const notification = new Notification({
      from: userId,
      to: post.user,
      type: "like",
    });
    await notification.save();
    const updatedLikes = post.likes;

    return res.status(200).json(updatedLikes);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in LikeandUnlike-Post", error.message);
  }
};

export const getPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No Posts Found" });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in GetAll-Post", error.message);
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const likedPost = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in GetLike-Post", error.message);
  }
};

export const getFollowingPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const following = user.following;

    const feedPost = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(feedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in GetFollowing-Post", error.message);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in GetUser-Post", error.message);
  }
};
