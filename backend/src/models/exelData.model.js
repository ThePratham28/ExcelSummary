import { model, Schema } from "mongoose";

const ExcelDataSchema = new Schema({}, { strict: false }); // This allows for dynamic fields in the schema, as Excel data can vary widely.

export const ExcelData = model("ExcelData", ExcelDataSchema);
