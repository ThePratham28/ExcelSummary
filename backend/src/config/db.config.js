import { connect } from "mongoose";
import logger from "../utils/winstonLogger.js";

export const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGODB_URI);
    logger.info(`Database connected successfully on ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error("Error connecting to the database", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};
