import express from "express";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
  methods: ["PUT", "GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
};

app.use(cors(corsOptions));

export default app;
