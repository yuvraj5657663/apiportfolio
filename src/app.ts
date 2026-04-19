import express from "express";
import cors from "cors";
import helmet from "helmet";

import routes from "./api/routes/index.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      process.env.FRONTEND_URL || "https://yourfrontend.vercel.app"
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(helmet());
app.use(express.json());

app.use("/api", routes);

// Global error handler — must be registered after all routes
app.use(errorHandler);

export default app;
