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
