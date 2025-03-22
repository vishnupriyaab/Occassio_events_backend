import { Router } from "express";
import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { emplAuthController } from "../controllers/management/employeeController/authConrtoller";

const employeeRouter = Router()
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("employee", iJwtServices);

employeeRouter
    .post( "/forgotPassword", emplAuthController.forgotPassword.bind(emplAuthController))
    .post( "/resetPassword", emplAuthController.resetPassword.bind(emplAuthController))

export default employeeRouter;