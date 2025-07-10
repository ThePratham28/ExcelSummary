import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  exportChartData,
  getChartDetails,
  getChartSuggestions,
} from "../controllers/chart.controller.js";

const router = Router();

router.get("/data/:fileId", authMiddleware("user"), getChartDetails);
router.get("/suggestions/:fileId", authMiddleware("user"), getChartSuggestions);
router.get("/data-export/:fileId", authMiddleware("user"), exportChartData);

export default router;
