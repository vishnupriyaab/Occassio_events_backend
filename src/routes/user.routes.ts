import { Router } from "express";
import express from "express";

import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { userEntryRegController } from "../controllers/management/userController/entryRegController";

const userRouter = Router();
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("user", iJwtServices);

userRouter.post(
  "/entry-reg",
  userEntryRegController.entryReg.bind(userEntryRegController)
);
userRouter.post(
  "/entry-payment-link",
  userEntryRegController.entryPayment.bind(userEntryRegController)
);

// userRouter.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   userEntryRegController.handlePaymentWebhook.bind(userEntryRegController)
// );

export default userRouter;
