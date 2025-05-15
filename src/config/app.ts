import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRouter from "../routes/admin.routes";
import morgan from "morgan";
import logger from "./logger";
import userRouter from "../routes/user.routes";
import refreshTokenRoute from "../routes/refresh.routes";
import { errorMiddleware } from "../middleware/errorHandling";
import employeeRouter from "../routes/employee.routes";
import { paymentController } from "../controllers/management/userController/paymentController";

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

// Handle both potential webhook paths
app.use("/user/webhook", express.raw({ type: "application/json" }));
app.use("/webhook", express.raw({ type: "application/json" }));

app.post(
  "/webhook",
  paymentController.handlePaymentWebhook.bind(paymentController)
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(logger);

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/employee", employeeRouter);
app.use("/refreshToken", refreshTokenRoute);

app.use(errorMiddleware);

export default app;
