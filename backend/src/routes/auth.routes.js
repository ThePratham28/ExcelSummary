import { Router } from "express";
import {
  loginUser,
  registerUser,
  userProfile,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", userProfile);

export default router;