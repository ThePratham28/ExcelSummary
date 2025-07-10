import { ExcelData } from "../models/excelData.model.js";

export const getChartDetails = async (req, res) => {
  try {
    const { title, xAxis, yAxis, chartType } = req.body;
    const { fileId } = req.params;
    const userId = req.userId;

    // Validate required fields
    if (!fileId || !userId) {
      return res
        .status(400)
        .json({ error: "File ID and User ID are required." });
    }

    const validChartTypes = [
      "bar",
      "line",
      "pie",
      "scatter",
      "area",
      "column",
      "3d-bar",
      "3d-pie",
    ];

    // Validate chart type
    if (!validChartTypes.includes(chartType)) {
      return res.status(400).json({ error: "Invalid chart type." });
    }

    const file = await ExcelData.findOne({ _id: fileId, user: userId });
    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }

    if (!file.data || file.data.length === 0) {
      return res
        .status(400)
        .json({ error: "No data available to generate chart." });
    }

    if (!file.columns.includes(xAxis) || !file.columns.includes(yAxis)) {
      return res.status(400).json({ error: "Invalid xAxis or yAxis column." });
    }

    // Prepare data for the chart
    const chartData = file.data
      .map((row) => ({
        x: row[xAxis],
        y: parseFloat(row[yAxis]) || 0,
      }))
      .filter((row) => row.x && !isNaN(row.y));

    res.status(200).json({
      fileId,
      filename: file.filename,
      title: title || `${yAxis} vs ${xAxis}`,
      xAxis,
      yAxis,
      chartType,
      data: chartData,
      dataPoints: chartData.length,
      generatedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add this function for getting chart suggestions
export const getChartSuggestions = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.userId;

    const file = await ExcelData.findOne({ _id: fileId, user: userId });
    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }

    // Analyze columns to suggest chart types
    const numericColumns = [];
    const textColumns = [];

    file.columns.forEach((column) => {
      const sampleValues = file.data.slice(0, 10).map((row) => row[column]);
      const numericValues = sampleValues.filter(
        (val) => !isNaN(parseFloat(val))
      );

      if (numericValues.length > sampleValues.length * 0.7) {
        numericColumns.push(column);
      } else {
        textColumns.push(column);
      }
    });

    const suggestions = [];

    // Suggest charts based on data types
    if (numericColumns.length >= 2) {
      suggestions.push({
        type: "scatter",
        xAxis: numericColumns[0],
        yAxis: numericColumns[1],
        title: `${numericColumns[1]} vs ${numericColumns[0]}`,
        description: "Good for showing correlation between numeric values",
      });
    }

    if (textColumns.length >= 1 && numericColumns.length >= 1) {
      suggestions.push({
        type: "bar",
        xAxis: textColumns[0],
        yAxis: numericColumns[0],
        title: `${numericColumns[0]} by ${textColumns[0]}`,
        description: "Good for comparing categories",
      });

      suggestions.push({
        type: "pie",
        xAxis: textColumns[0],
        yAxis: numericColumns[0],
        title: `Distribution of ${numericColumns[0]}`,
        description: "Good for showing proportions",
      });
    }

    res.status(200).json({
      numericColumns,
      textColumns,
      suggestions,
      totalRows: file.data.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exportChartData = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { xAxis, yAxis, format = "json" } = req.query;
    const userId = req.userId;

    const file = await ExcelData.findOne({ _id: fileId, user: userId });
    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }

    const chartData = file.data
      .map((row) => ({
        [xAxis]: row[xAxis],
        [yAxis]: parseFloat(row[yAxis]) || 0,
      }))
      .filter((row) => row[xAxis] && !isNaN(row[yAxis]));

    if (format === "csv") {
      const csv = [
        `${xAxis},${yAxis}`,
        ...chartData.map((row) => `${row[xAxis]},${row[yAxis]}`),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="chart-data.csv"`
      );
      return res.send(csv);
    }

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
