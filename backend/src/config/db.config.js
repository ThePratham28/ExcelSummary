import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGODB_URI);
    console.log("Database connected successfully on", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
};
