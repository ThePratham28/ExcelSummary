import { ExcelData } from "../models/excelData.model.js";
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

    await ExcelData.deleteMany({ user: id });

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

    res.status(200).json({
      totalUsers,
      totalFiles,
      userStats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
