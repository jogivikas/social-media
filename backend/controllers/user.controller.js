// controllers/user.controller.js
import User from "../models/user.model.js";
import Profile from "../models/profiles.model.js";
import bcrypt from "bcrypt";

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
