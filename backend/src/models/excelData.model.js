import { model, Schema, Types } from "mongoose";

const ExcelDataSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    filename: String,
    columns: [String],
    data: [{}],
    uploadedAt: { type: Date, default: Date.now },
  },
  { strict: false }
);

export const ExcelData = model("ExcelData", ExcelDataSchema);
