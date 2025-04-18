import { Router } from "express";
import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { emplAuthController } from "../controllers/management/employeeController/authConrtoller";
import { emplProfileController } from "../controllers/management/employeeController/profileController";
import { upload } from "../middleware/claudinaryUpload";
import { emplClientController } from "../controllers/management/employeeController/clientController";
import { emplChatController } from "../controllers/management/employeeController/chatController";

const employeeRouter = Router()
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("employee", iJwtServices);

//private - routes
employeeRouter
    .post('/login',emplAuthController.employeeLogin.bind(emplAuthController))
    .post( "/forgotPassword", emplAuthController.forgotPassword.bind(emplAuthController))
    .post( "/resetPassword", emplAuthController.resetPassword.bind(emplAuthController));

// Protected routes (middleware applied)
employeeRouter.use(authMiddleware.authenticateToken.bind(authMiddleware));

employeeRouter
    .get("/showProfile", emplProfileController.showProfile.bind(emplProfileController))
    .put("/updateProfile", emplProfileController.updateProfile.bind(emplProfileController))
    .put("/profileImage",upload.single("img"), emplProfileController.updateProfileImage.bind(emplProfileController))
    .get("/fetchClient", emplClientController.fetchClients.bind(emplClientController))
    .get('/getchats', emplChatController.getChats.bind(emplChatController))
    .get("/getconversationdata", emplChatController.getConversationData.bind(emplChatController))
    .get('/conversation/:conversationId', emplChatController.getConversationId.bind(emplChatController));

export default employeeRouter;