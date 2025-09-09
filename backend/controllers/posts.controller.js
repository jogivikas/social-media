import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import Profiles from "../models/profiles.model.js";
import bcrypt from "bcrypt";
import { Router } from "express";

export const activeCheck = async (req, res) => {
  return res.status(200).json({
    message: "RUNNING",
  });
};

export const createPost = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });
    await post.save();
    return res.status(200).json({
      message: "Post created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate(
      "userId",
      "name email  username profilePicture"
    );
    return res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const post = await Post.findOneAndDelete({
      _id: post_id,
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (err) {}
};
