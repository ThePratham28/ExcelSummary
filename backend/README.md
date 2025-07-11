# Excel Analytics Platform – Backend

This is the backend service for the Excel Analytics Platform. It provides secure RESTful APIs for user authentication, Excel file upload and management, data analysis, chart generation, AI-powered insights, and admin operations.

---

## Features

- **User Authentication:** Register, login, logout, and profile management with JWT-based cookies.
- **Excel File Management:** Upload, list, retrieve, and delete Excel files (`.xls`, `.xlsx`).
- **Chart Generation:** Generate chart-ready data (bar, line, pie, scatter, area, etc.) from uploaded Excel files.
- **AI Insights:** Get AI-generated summaries and insights for your data using Google Gemini.
- **Admin Tools:** List all users, delete users, and view user statistics.
- **Logging:** Structured logging with request IDs and daily log rotation.
- **API Documentation:** Swagger/OpenAPI docs at `/api-docs`.

---

## Tech Stack

- **Node.js** (ES Modules)
- **Express.js**
- **MongoDB** (via Mongoose)
- **Multer** (file uploads)
- **Argon2** (password hashing)
- **JWT** (authentication)
- **Winston** (logging)
- **Swagger** (API docs)
- **Google Gemini API** (AI insights)
- **Docker** (containerization)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance
- Google Gemini API Key

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/excel-analytics
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
```

### Installation

```bash
npm install
```

### Running the Server

```bash
npm run dev
```

Or with Docker:

```bash
docker build -t excel-analytics-backend .
docker run -p 8080:8080 --env-file .env excel-analytics-backend
```

---

## API Overview

### Authentication

- `POST   /auth/register` – Register a new user
- `POST   /auth/login` – Login and receive auth cookie
- `POST   /auth/logout` – Logout and clear cookie
- `GET    /auth/profile` – Get current user profile

### Excel File Management

- `POST   /excel/upload` – Upload Excel file (multipart/form-data)
- `GET    /excel/` – List user's uploaded files
- `GET    /excel/:id` – Get data for a specific file
- `DELETE /excel/:id` – Delete a file

### Chart & AI

- `POST   /charts/data/:fileId` – Get chart data for a file
- `GET    /charts/suggestions/:fileId` – Get chart type suggestions
- `GET    /charts/data-export/:fileId` – Export chart data (CSV/JSON)
- `GET    /charts/insights/:fileId` – AI-generated insights
- `POST   /charts/summarize/:fileId` – AI data summary

### Admin

- `GET    /admin/get-all-users` – List all users (admin only)
- `DELETE /admin/delete-user/:id` – Delete a user (admin only)
- `GET    /admin/user-stats` – User/file statistics (admin only)

### Health & Docs

- `GET    /health` – Health check
- `GET    /api-docs` – Swagger UI
- `GET    /api-docs.json` – OpenAPI JSON

---

## Logging

- Logs are stored in `/logs` with daily rotation.
- Each request is tagged with a unique `requestId` for traceability.

---

## Project Structure

```
backend/
  ├── src/
  │   ├── config/         # Configuration files (DB, multer, swagger, etc.)
  │   ├── controllers/    # Route handlers (auth, admin, excel, chart)
  │   ├── middleware/     # Express middlewares (auth, error handler, etc.)
  │   ├── models/         # Mongoose models (User, ExcelData, etc.)
  │   ├── routes/         # Express routers (auth, excel, chart, admin)
  │   └── utils/          # Utility modules (logging, AI service, etc.)
  ├── logs/               # Application and error logs
  ├── Dockerfile
  ├── index.js            # App entry point
  ├── package.json
  └── .env
```

---

## Security

- Passwords are hashed with Argon2.
- JWT tokens are stored in `httpOnly` cookies.
- Role-based access control for user/admin routes.
- CORS is restricted to the frontend URL.

---

## API Documentation

Interactive API docs are available at:  
[http://localhost:8080/api-docs](http://localhost:8080/api-docs)

---