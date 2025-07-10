import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  deleteUser,
  getAllUsers,
  getUserStats,
} from "../controllers/admin.controller.js";

const router = Router();

/**
 * @swagger
 * /admin/get-all-users:
 *   get:
 *     summary: Get all users in the system
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     description: Retrieves a list of all registered users. Accessible only to admin users.
 *     responses:
 *       200:
 *         description: A list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - Not logged in or not an admin
 *       500:
 *         description: Server error
 */
router.get("/get-all-users", authMiddleware("admin"), getAllUsers);

/**
 * @swagger
 * /admin/delete-user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     description: Deletes a user from the system. Accessible only to admin users.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to delete
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       401:
 *         description: Unauthorized - Not logged in or not an admin
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/delete-user/:id", authMiddleware("admin"), deleteUser);

/**
 * @swagger
 * /admin/user-stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     description: Retrieves statistics about users in the system. Accessible only to admin users.
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *                   example: 250
 *                 newUsersThisMonth:
 *                   type: number
 *                   example: 25
 *                 usersByRole:
 *                   type: object
 *                   properties:
 *                     admin:
 *                       type: number
 *                       example: 5
 *                     user:
 *                       type: number
 *                       example: 245
 *                 activeUsers:
 *                   type: number
 *                   example: 120
 *       401:
 *         description: Unauthorized - Not logged in or not an admin
 *       500:
 *         description: Server error
 */
router.get("/user-stats", authMiddleware("admin"), getUserStats);

export default router;