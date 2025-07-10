import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Excel Analytics Platform API",
    version: "1.0.0",
    description: "API documentation for the Excel Analytics Platform",
    contact: {
      name: "API Support",
      email: "support@excelanalytics.com",
    },
  },
  servers: [
    {
      url: process.env.API_BASE_URL || `http://localhost:${process.env.PORT}`,
      description: "server",
    },
  ],
  components: {
    securitySchemes: {
      type: "apiKey",
      in: "cookie",
      name: "token",
    },
  },
  security: [
    {
      cookieAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js", "./src/models/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
