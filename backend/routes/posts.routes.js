import { Router } from "express";
import { activeCheck } from "../controllers/posts.controller.js";
import {
  createPost,
  getAllPosts,
  deletePost,
} from "../controllers/posts.controller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.route("/active").get(activeCheck);

router.route("/post").post(upload.single("media"), createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").post(deletePost);

export default router;
