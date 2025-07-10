import fs from "fs";
import path from "path";
import winston from "winston";
import "winston-daily-rotate-file";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, "../../logs");

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const fileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, "application-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
});

const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
  level: "error",
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const requestId = meta.requestId ? `[${meta.requestId}] ` : "";
      return `${timestamp} ${level}: ${requestId}${message} ${
        Object.keys(meta).length && !meta.requestId ? JSON.stringify(meta) : ""
      }`;
    })
  ),
});

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  defaultMeta: { service: "excel-summary-api" },
  transports: [fileTransport, errorFileTransport, consoleTransport],
});

// Create a request context middleware that adds a unique requestId to each request
export const requestContext = (req, res, next) => {
  req.requestId = uuidv4();
  res.locals.logger = {
    debug: (message, meta = {}) =>
      logger.debug(message, { requestId: req.requestId, ...meta }),
    info: (message, meta = {}) =>
      logger.info(message, { requestId: req.requestId, ...meta }),
    warn: (message, meta = {}) =>
      logger.warn(message, { requestId: req.requestId, ...meta }),
    error: (message, meta = {}) =>
      logger.error(message, { requestId: req.requestId, ...meta }),
  };
  next();
};

// Create HTTP request logger middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request details
  res.locals.logger.info(`${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  // Capture response details after the request is completed
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? "warn" : "info";

    res.locals.logger[logLevel](
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
      {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: duration,
      }
    );
  });

  next();
};

export default logger;
