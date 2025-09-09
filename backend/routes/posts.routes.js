import { Router } from "express";
import { activeCheck } from "../controllers/posts.controller.js";
import { createPost } from "../controllers/posts.controller.js";
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

export default router;
