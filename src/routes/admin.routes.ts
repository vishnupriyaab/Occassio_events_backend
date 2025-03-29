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
adminRouter.post("/register",adminAuthController.adminRegister.bind(adminAuthController))

// Protected routes (middleware applied)
adminRouter.use(authMiddleware.authenticateToken.bind(authMiddleware));
adminRouter.post( "/logOut", adminAuthController.logOut.bind(adminAuthController));
adminRouter
.get("/employees", adminEmplController.getEmployee.bind(adminEmplController))
.post('/employees', adminEmplController.addEmployee.bind(adminEmplController))
.patch("/employees/:id", adminEmplController.blockEmployee.bind(adminEmplController))
.delete("/employees/:id",adminEmplController.deleteEmployee.bind(adminEmplController));


export default adminRouter;