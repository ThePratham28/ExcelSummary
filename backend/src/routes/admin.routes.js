import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { deleteUser, getAllUsers, getUserStats } from "../controllers/admin.controller.js";

const router = Router();

router.get("/get-all-users", authMiddleware("admin"), getAllUsers);
router.delete("/delete-user/:id", authMiddleware("admin"), deleteUser);
router.get("/user-stats", authMiddleware("admin"), getUserStats);

export default router;