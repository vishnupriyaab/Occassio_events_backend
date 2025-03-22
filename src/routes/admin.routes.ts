import { Router } from "express";
import { adminAuthController } from "../controllers/management/adminController/authController";
import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { adminEmplController } from "../controllers/management/adminController/employeeController";

const adminRouter = Router();
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("admin", iJwtServices);

//private - routes
adminRouter.post(
  "/login",
  adminAuthController.adminLogin.bind(adminAuthController)
);

// Protected routes (middleware applied)
adminRouter.use(authMiddleware.authenticateToken.bind(authMiddleware));
adminRouter.post( "/logOut", adminAuthController.logOut.bind(adminAuthController));

adminRouter.post('/employees', adminEmplController.addEmployee.bind(adminEmplController))


export default adminRouter;