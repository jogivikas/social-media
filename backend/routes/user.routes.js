// routes/user.routes.js
import { Router } from "express";
import { register } from "../controllers/user.controller.js";
import { login } from "../controllers/user.controller.js";

const router = Router();

// consider prefixing your routes (set in server with app.use('/api/users', userRoutes))
router.route("/register").post(register);
router.route("/login").post(login);

export default router;
