import { ExcelData } from "../models/excelData.model.js";
import { generateDataInsights } from "../utils/aiService.js";

export const getChartDetails = async (req, res) => {
  const logger = res.locals.logger;
  const { title, xAxis, yAxis, chartType } = req.body;
  const { fileId } = req.params;
  const userId = req.userId;

  logger.info("Generating chart details", {
    userId,
    fileId,
    chartType,
    xAxis,
    yAxis,
  });

  try {
    // Validate required fields
    if (!fileId || !userId) {
      logger.warn("Chart generation failed: missing required fields", {
        userId,
        fileId,
      });
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
      logger.warn("Chart generation failed: invalid chart type", {
        userId,
        fileId,
        chartType,
      });
      return res.status(400).json({ error: "Invalid chart type." });
    }

    const file = await ExcelData.findOne({ _id: fileId, user: userId });
    if (!file) {
      logger.warn("Chart generation failed: file not found", {
        userId,
        fileId,
      });
      return res.status(404).json({ error: "File not found." });
    }

    if (!file.data || file.data.length === 0) {
      logger.warn("Chart generation failed: no data available", {
        userId,
        fileId,
        filename: file.filename,
      });
      return res
        .status(400)
        .json({ error: "No data available to generate chart." });
    }

    if (!file.columns.includes(xAxis) || !file.columns.includes(yAxis)) {
      logger.warn("Chart generation failed: invalid axis columns", {
        userId,
        fileId,
        filename: file.filename,
        xAxis,
        yAxis,
        availableColumns: file.columns,
      });
      return res.status(400).json({ error: "Invalid xAxis or yAxis column." });
    }

    // Prepare data for the chart
    const chartData = file.data
      .map((row) => ({
        x: row[xAxis],
        y: parseFloat(row[yAxis]) || 0,
      }))
      .filter((row) => row.x && !isNaN(row.y));

    logger.debug("Chart data prepared", {
      userId,
      fileId,
      dataPoints: chartData.length,
    });

    const chartTitle = title || `${yAxis} vs ${xAxis}`;

    logger.info("Chart generated successfully", {
      userId,
      fileId,
      filename: file.filename,
      chartType,
      dataPoints: chartData.length,
    });

    res.status(200).json({
      fileId,
      filename: file.filename,
      title: chartTitle,
      xAxis,
      yAxis,
      chartType,
      data: chartData,
      dataPoints: chartData.length,
      generatedAt: new Date(),
    });
  } catch (error) {
    logger.error("Error generating chart", {
      userId,
      fileId,
      chartType,
      xAxis,
      yAxis,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
  }
};

export const getChartSuggestions = async (req, res) => {
  const logger = res.locals.logger;
  const { fileId } = req.params;
  const userId = req.userId;

  logger.info("Generating chart suggestions", { userId, fileId });

  try {
    const file = await ExcelData.findOne({ _id: fileId, user: userId });
    if (!file) {
      logger.warn("Chart suggestions failed: file not found", {
        userId,
        fileId,
      });
      return res.status(404).json({ error: "File not found." });
    }

    // Analyze columns to suggest chart types
    const numericColumns = [];
    const textColumns = [];

    logger.debug("Analyzing columns for chart suggestions", {
      userId,
      fileId,
      columnCount: file.columns.length,
    });

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

    logger.info("Chart suggestions generated successfully", {
      userId,
      fileId,
      filename: file.filename,
      numericColumnsCount: numericColumns.length,
      textColumnsCount: textColumns.length,
      suggestionsCount: suggestions.length,
    });

    res.status(200).json({
      numericColumns,
      textColumns,
      suggestions,
      totalRows: file.data.length,
    });
  } catch (error) {
    logger.error("Error generating chart suggestions", {
      userId,
      fileId,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
  }
};

export const getAIInsights = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.userId;

    const logger = res.locals.logger;
    logger.info("Generating AI insights", { userId, fileId });

    const file = await ExcelData.findOne({ _id: fileId, user: userId });
    if (!file) {
      logger.warn("AI insights generation failed: file not found", {
        userId,
        fileId,
      });
      return res.status(404).json({ error: "File not found." });
    }

    if (!file.data || file.data.length === 0) {
      logger.warn("AI insights generation failed: no data available", {
        userId,
        fileId,
        filename: file.filename,
      });
      return res
        .status(400)
        .json({ error: "No data available to generate insights." });
    }

    // Generate insights using AI service
    const insights = await generateDataInsights(file.data, file.columns);

    logger.info("AI insights generated successfully", {
      userId,
      fileId,
      filename: file.filename,
      insightsCount: Object.keys(insights).length,
    });

    res.status(200).json({
      fileId,
      filename: file.filename,
      insights,
      generatedAt: new Date(),
    });
  } catch (error) {
    const logger = res.locals.logger;
    logger.error("Error generating AI insights", {
      userId: req.userId,
      fileId: req.params.fileId,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Failed to generate AI insights." });
  }
};

export const summarizeData = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.userId;
    const { columns = [] } = req.body;

    const logger = res.locals.logger;
    logger.info("Summarizing data", { userId, fileId, columns });

    const file = await ExcelData.findOne({ _id: fileId, user: userId });
    if (!file) {
      logger.warn("Data summarization failed: file not found", {
        userId,
        fileId,
      });
      return res.status(404).json({ error: "File not found." });
    }

    let dataToAnalyze = file.data;
    let columnsToAnalyze = file.columns;

    if (columns.length > 0) {
      const invalidColumns = columns.filter(
        (col) => !file.columns.includes(col)
      );
      if (invalidColumns.length > 0) {
        logger.warn("Data summarization failed: invalid columns", {
          userId,
          fileId,
          invalidColumns,
        });
        return res
          .status(400)
          .json({ error: "Invalid columns specified.", invalidColumns });
      }

      dataToAnalyze = file.data.map((row) => {
        const filteredRow = {};
        columns.forEach((col) => {
          filteredRow[col] = row[col];
        });
        return filteredRow;
      });
      columnsToAnalyze = columns;
    }

    const summary = await generateDataInsights(
      dataToAnalyze,
      columnsToAnalyze,
      "focused excel"
    );

    logger.info("Data summarized successfully", {
      userId,
      fileId,
      filename: file.filename,
      columnsAnalyzed: columnsToAnalyze.length,
      summaryKeys: Object.keys(summary).length,
    });
    res.status(200).json({
      fileId,
      filename: file.filename,
      summary,
      analyzedColumns: columnsToAnalyze,
      generatedAt: new Date(),
    });
  } catch (error) {
    const logger = res.locals.logger;
    logger.error("Error summarizing data", {
      userId: req.userId,
      fileId: req.params.fileId,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Failed to summarize data." });
  }
};

export const exportChartData = async (req, res) => {
  const logger = res.locals.logger;
  const { fileId } = req.params;
  const { xAxis, yAxis, format = "json" } = req.query;
  const userId = req.userId;

  logger.info("Exporting chart data", {
    userId,
    fileId,
    xAxis,
    yAxis,
    format,
  });

  try {
    const file = await ExcelData.findOne({ _id: fileId, user: userId });
    if (!file) {
      logger.warn("Chart data export failed: file not found", {
        userId,
        fileId,
      });
      return res.status(404).json({ error: "File not found." });
    }

    const chartData = file.data
      .map((row) => ({
        [xAxis]: row[xAxis],
        [yAxis]: parseFloat(row[yAxis]) || 0,
      }))
      .filter((row) => row[xAxis] && !isNaN(row[yAxis]));

    logger.debug("Chart data prepared for export", {
      userId,
      fileId,
      dataPoints: chartData.length,
      format,
    });

    if (format === "csv") {
      const csv = [
        `${xAxis},${yAxis}`,
        ...chartData.map((row) => `${row[xAxis]},${row[yAxis]}`),
      ].join("\n");

      logger.info("Chart data exported as CSV", {
        userId,
        fileId,
        filename: file.filename,
        dataPoints: chartData.length,
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="chart-data.csv"`
      );
      return res.send(csv);
    }

    logger.info("Chart data exported as JSON", {
      userId,
      fileId,
      filename: file.filename,
      dataPoints: chartData.length,
    });

    res.json(chartData);
  } catch (error) {
    logger.error("Error exporting chart data", {
      userId,
      fileId,
      xAxis,
      yAxis,
      format,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
  }
};
