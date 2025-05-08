import { Router } from "express";
import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { emplAuthController } from "../controllers/management/employeeController/authConrtoller";
import { emplProfileController } from "../controllers/management/employeeController/profileController";
import { upload } from "../middleware/claudinaryUpload";
import { emplClientController } from "../controllers/management/employeeController/clientController";
import { emplChatController } from "../controllers/management/employeeController/chatController";
import { emplNoteController } from "../controllers/management/employeeController/noteController";
import { emplEstimationController } from "../controllers/management/employeeController/estimationController";
import { emplVideoCallController } from "../controllers/management/employeeController/videoCallController";

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
    .get('/conversation/:conversationId', emplChatController.getConversationId.bind(emplChatController))
    .get('/lastMessage/:conversationId', emplChatController.getLastMessage.bind(emplChatController))
    .delete('/message/:conversationId/:messageId', emplChatController.deleteMessage.bind(emplChatController))
    .post("/notes", emplNoteController.saveNote.bind(emplNoteController))
    .get("/notes", emplNoteController.getNotes.bind(emplNoteController))
    .put("/notes/:noteId", emplNoteController.editNotes.bind(emplNoteController))
    .post("/estimation",emplEstimationController.saveEstimation.bind(emplEstimationController))
    .get("/estimation", emplEstimationController.fetchEstimation.bind(emplEstimationController))
    .post('/initiate', emplVideoCallController.initiateCall.bind(emplVideoCallController))
    .patch('/status/:callId', emplVideoCallController.updateCallStatus.bind(emplVideoCallController))
    .get('/history/:conversationId', emplVideoCallController.getCallHistory.bind(emplVideoCallController))
    
export default employeeRouter;  