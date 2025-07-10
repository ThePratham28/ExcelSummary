import { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { exportChartData, getChartDetails, getChartSuggestions } from "../controllers/chart.controller.js";

const router = Router();

router.get("/data/:fileId", authMiddleware, getChartDetails);
router.get("/suggestions/:fileId", authMiddleware, getChartSuggestions);
router.get("/data-export/:fileId", authMiddleware, exportChartData);

export default router;