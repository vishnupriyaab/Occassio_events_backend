import { Router } from "express";
import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { userEntryRegController } from "../controllers/management/userController/entryRegController";

const userRouter = Router();
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("user", iJwtServices);


userRouter.post('/entry-reg',userEntryRegController.entryReg.bind(userEntryRegController))

export default userRouter;