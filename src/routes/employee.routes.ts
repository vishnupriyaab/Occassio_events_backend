import { Router } from "express";
import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { emplAuthController } from "../controllers/management/employeeController/authConrtoller";

const employeeRouter = Router()
// const iJwtServices: IJWTService = new JWTService();
// const authMiddleware = new AuthMiddleware("employee", iJwtServices);

//private - routes
employeeRouter
    .post('/login',emplAuthController.employeeLogin.bind(emplAuthController))
    .post( "/forgotPassword", emplAuthController.forgotPassword.bind(emplAuthController))
    .post( "/resetPassword", emplAuthController.resetPassword.bind(emplAuthController));

// // Protected routes (middleware applied)
// employeeRouter.use(authMiddleware.authenticateToken.bind(authMiddleware));

export default employeeRouter;