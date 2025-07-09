import { readFile, utils } from "xlsx";

export const parseExcelFile = (filePath) => {
  const workbook = readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = utils.sheet_to_json(workbook.Sheets[sheetName]);
  return sheetData;
};
