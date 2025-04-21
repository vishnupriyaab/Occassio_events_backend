import { Router } from "express";
import express from "express";

import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { userEntryRegController } from "../controllers/management/userController/entryRegController";
import { userAuthController } from "../controllers/management/userController/authController";
import { subClientController } from "../controllers/management/userController/subscribtionClientController";
import { userChatController } from "../controllers/management/userController/chatController";
import { employeeController } from "../controllers/management/userController/employeeController";

const userRouter = Router();
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("user", iJwtServices);

userRouter
  .post( "/entry-reg", userEntryRegController.entryReg.bind(userEntryRegController))
  .post( "/entry-payment-link", userEntryRegController.entryPayment.bind(userEntryRegController))
  .post("/resetPassword", userAuthController.resetPassword.bind(userAuthController))
  .post("/forgotPassword", userAuthController.forgotPassword.bind(userAuthController))
  .post("/login", userAuthController.userLogin.bind(userAuthController))
  .post("/google-login", userAuthController.googleLogin.bind(userAuthController))
  
  // Protected routes (middleware applied)
userRouter.use(authMiddleware.authenticateToken.bind(authMiddleware));

userRouter.get("/sub-details", subClientController.fetchSubClientData.bind(subClientController))
  .get('/getchats', userChatController.getChats.bind(userChatController))
  .get('/conversation', userChatController.getConversationId.bind(userChatController))
  .get("/getEmployeeDetails/:employeeId", employeeController.fetchEmployeeDetails.bind(employeeController))
  .delete('/message/:conversationId/:messageId', userChatController.deleteMessage.bind(userChatController))


export default userRouter;
