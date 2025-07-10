import { ExcelData } from "../models/excelData.model.js";
import { UserModel } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  const logger = res.locals.logger;
  const adminId = req.userId;

  logger.info("Admin retrieving all users", { adminId });

  try {
    const users = await UserModel.find().select("-password -__v");

    logger.info("All users retrieved successfully", {
      adminId,
      userCount: users.length,
    });

    res.status(200).json(users);
  } catch (error) {
    logger.error("Error retrieving all users", {
      adminId,
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const logger = res.locals.logger;
  const adminId = req.userId;
  const userId = req.params.id;

  logger.info("Admin deleting user", { adminId, userId });

  try {
    // Delete associated files first
    const deleteResult = await ExcelData.deleteMany({ user: userId });

    logger.debug("User's files deleted", {
      adminId,
      userId,
      filesDeleted: deleteResult.deletedCount,
    });

    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
      logger.warn("User deletion failed: user not found", { adminId, userId });
      return res.status(404).json({ error: "User not found" });
    }

    logger.info("User deleted successfully", {
      adminId,
      userId,
      username: user.username,
      email: user.email,
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    logger.error("Error deleting user", {
      adminId,
      userId,
      error: err.message,
      stack: err.stack,
    });

    res.status(500).json({ error: err.message });
  }
};

export const getUserStats = async (req, res) => {
  const logger = res.locals.logger;
  const adminId = req.userId;

  logger.info("Admin retrieving user statistics", { adminId });

  try {
    const totalUsers = await UserModel.countDocuments({
      role: { $ne: "admin" },
    });
    const totalFiles = await ExcelData.countDocuments();

    logger.debug("Basic statistics retrieved", {
      adminId,
      totalUsers,
      totalFiles,
    });

    const userStats = await UserModel.aggregate([
      {
        $lookup: {
          from: ExcelData.collection.name,
          localField: "_id",
          foreignField: "user",
          as: "files",
        },
      },
      {
        $project: {
          username: 1,
          email: 1,
          role: 1,
          createdAt: 1,
          fileCount: { $size: "$files" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    logger.info("User statistics retrieved successfully", {
      adminId,
      totalUsers,
      totalFiles,
      userStatsCount: userStats.length,
    });

    res.status(200).json({
      totalUsers,
      totalFiles,
      userStats,
    });
  } catch (err) {
    logger.error("Error retrieving user statistics", {
      adminId,
      error: err.message,
      stack: err.stack,
    });

    res.status(500).json({ error: err.message });
  }
};
