import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  school: {
    type: String,
    default: "",
  },
  degree: {
    type: String,
    default: "",
  },
  fieldOfStudy: {
    type: String,
    default: "",
  },
});
const workSchema = new mongoose.Schema({
  company: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "",
  },
  years: {
    type: String,
    default: "",
  },
});

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bio: {
    type: String,
    default: "",
  },
  currentPostion: {
    type: String,
    default: "",
  },
  education: {
    type: [educationSchema],
    default: [],
  },
  pastWork: {
    type: [workSchema],
    default: [],
  },
});
const Profiles = mongoose.model("Profiles", profileSchema);
export default Profiles;
