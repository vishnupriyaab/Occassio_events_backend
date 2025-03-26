import { Router } from "express";
import express from "express";

import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { userEntryRegController } from "../controllers/management/userController/entryRegController";
import { userAuthController } from "../controllers/management/userController/authController";

const userRouter = Router();
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("user", iJwtServices);

userRouter
  .post( "/entry-reg", userEntryRegController.entryReg.bind(userEntryRegController))
  .post( "/entry-payment-link", userEntryRegController.entryPayment.bind(userEntryRegController))
  .post("/resetPassword", userAuthController.resetPassword.bind(userAuthController))
  .post("/forgotPassword", userAuthController.forgotPassword.bind(userAuthController))

export default userRouter;
