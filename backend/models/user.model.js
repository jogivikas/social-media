import mongoose from "mongoose";

import { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,

    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profilePicture: {
    type: String,
    default: "default.jpg",
  },
  token: {
    type: String,
    default: "",
  },
});

export default mongoose.model("User", UserSchema);
