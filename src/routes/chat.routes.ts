import { Router } from "express";
import { JWTService } from "../integration/jwtServices";
import { IJWTService } from "../interfaces/integration/IJwt";
import AuthMiddleware from "../middleware/authenticateToken";
import { chatController } from "../controllers/management/chatController";

const chatRouter = Router();
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("user", iJwtServices);

// Public routes
chatRouter.get('/getconversationdata', chatController.getConversationData.bind(chatController));

// Protected routes (middleware applied)
chatRouter.use(authMiddleware.authenticateToken.bind(authMiddleware));
chatRouter.get('/getchats', chatController.getChats.bind(chatController));
chatRouter.get('/conversation', chatController.getConversationId.bind(chatController));

export default chatRouter;