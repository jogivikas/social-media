// controllers/user.controller.js
import User from "../models/user.model.js";
import Profile from "../models/profiles.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // DON'T reuse the name "User" — use existingUser or foundUser
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // You can use create (which saves) or new User() + save()
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      username,
    });

    // Create and save profile (remember to await)
    const profile = new Profile({
      userId: newUser._id,
      // add other default profile fields if needed
    });
    await profile.save();

    return res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(400).json({
      message: err.message || "Something went wrong",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // password matched — generate token, save it and return it
    const token = crypto.randomBytes(64).toString("hex");
    await User.updateOne({ _id: user._id }, { token });

    return res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.profilePicture = req.file.path;
    await user.save();
    return res.status(200).json({
      message: "Profile picture uploaded successfully",
    });
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const { username, email } = newUserData;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
    }
    Object.assign(user, newUserData);
    await user.save();
    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email  username profilePicture"
    );
    return res.json(userProfile);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    const userProfile = await User.findOne({ token: token });

    if (!userProfile) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });
    Object.assign(profile_to_update, newProfileData);
    await profile_to_update.save();
    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const allProfiles = await Profile.find().populate(
      "userId",
      "name email  username profilePicture"
    );
    return res.status(200).json({ allProfiles });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
