import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const generateDataInsights = async (
  data,
  columns,
  dataType = "excel"
) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }

    const sampleData = data.slice(0, 25);

    const columnTypes = {};

    columns.forEach((column) => {
      const values = sampleData
        .map((row) => row[column])
        .filter((v) => v !== null && v !== undefined);
      const numericCount = values.filter((v) => !isNaN(parseFloat(v))).length;
      columnTypes[column] =
        numericCount > values.length * 0.7 ? "numeric" : "categorical";
    });

    // Create prompt for AI
    const prompt = {
      contents: [
        {
          parts: [
            {
              text: `You are a data analysis expert. Analyze this ${dataType} data and provide insights:
              Column Information: ${JSON.stringify(columnTypes)}
              Data Sample: ${JSON.stringify(sampleData, null, 2)}
              Please provide:
                1. A brief summary of what the data represents
                2. Key observations and patterns in the data
                3. Potential correlations between variables
                4. Recommended visualizations for this data
                5. Business insights that might be valuable
  
              Format your response as JSON with these sections.`,
            },
          ],
        },
      ],
    };

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      prompt,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let insights = response.data.candidates[0].content.parts[0].text;

    try {
      if (insights.includes("```json")) {
        insights = insights.split("```json")[1].split("```")[0].trim();
      }
      insights = JSON.parse(insights);
    } catch (e) {
      insights = { raw: insights.trim() };
    }

    return insights;
  } catch (error) {
    console.error("AI Insight Generation Error:", error);
    throw new Error(`Failed to generate AI insights: ${error.message}`);
  }
};
