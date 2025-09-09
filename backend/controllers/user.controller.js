// controllers/user.controller.js
import User from "../models/user.model.js";
import Profile from "../models/profiles.model.js";
import Connections from "../models/connections.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import { connect } from "http2";

const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(16).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);
  doc.image(`uploads/${userData.userId.profilePicture}`, 100, 20, {
    width: 100,
  });
  doc.fontSize(14).text(`Name: ${userData.userId.name}`, 100, 150);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`, 100, 180);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`, 100, 210);
  doc.fontSize(14).text(`Bio: ${userData.bio}`, 100, 240);
  doc.fontSize(14).text(`Current Position: ${userData.currentPost}`, 100, 270);

  doc.fontSize(14).text("Past Work:");
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Company: ${work.company}`, 100, 300 + index * 30);
    doc.fontSize(14).text(`Position: ${work.position}`, 100, 330 + index * 30);
    doc.fontSize(14).text(`Years: ${work.years}`, 100, 360 + index * 30);
  });
  doc.end();

  return outputPath;
};

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

export const downloadResume = async (req, res) => {
  const user_id = req.query.id;

  const userProfile = await Profile.findOne({ userId: user_id }).populate(
    "userId",
    "name email  username profilePicture"
  );
  let outputPath = await convertUserDataToPDF(userProfile);
  return res.status(200).json({ message: outputPath });
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const connectUser = await User.findOne({ _id: connectionId });
    if (!connectUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const existingRequest = await Connections.findOne({
      userId: user._id,
      connectionId: connectUser._id,
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "Connection request already sent",
      });
    }
    const request = new Connections({
      userId: user._id,
      connectionId: connectUser._id,
    });
    await request.save();
    return res.status(200).json({
      message: "Connection request sent successfully",
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};
export const getMyConnectionRequest = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const connections = await Connections.find({ userId: user._id }).populate(
      "connectionId",
      "name email  username profilePicture"
    );

    return res.status(200).json({ connections });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

export const whatAreMyConnections = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const connections = await Connections.find({
      connectionId: user._id,
    }).populate("userId", "name email  username profilePicture");
    return res.status(200).json({ connections });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, connectionId, action_type } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const connection = await User.findOne({ _id: connectionId });
    if (!connection) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (action_type === "accept") {
      connection.status.accepted = true;
    } else {
      connection.status.acccepted = false;
    }
    await connection.save();
    return res.status(200).json({
      message: "Request updated",
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};
