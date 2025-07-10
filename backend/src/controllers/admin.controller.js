import { ExcelData } from "../models/excelData.model";
import { UserModel } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password -__v");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete user's files and charts
    await ExcelData.deleteMany({ user: id });

    // Delete user
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments({
      role: { $ne: "admin" },
    });
    const totalFiles = await ExcelData.countDocuments();

    const userStats = await UserModel.aggregate([
      {
        $lookup: {
          from: "exceldatas",
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

    res.status(200).json({
      totalUsers,
      totalFiles,
      totalCharts,
      userStats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
