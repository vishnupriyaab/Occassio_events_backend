import { Router } from "express";
import { adminAuthController } from "../controllers/management/adminController/authController";
import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { adminEmplController } from "../controllers/management/adminController/employeeController";
import { adminUserController } from "../controllers/management/adminController/userController";
import { adminDashboardController } from "../controllers/management/adminController/dashboardController";

const adminRouter = Router();
const iJwtServices: IJWTService = new JWTService()
const authMiddleware = new AuthMiddleware("admin", iJwtServices)

//private - routes
adminRouter.post( "/login", adminAuthController.adminLogin.bind(adminAuthController))
.get("/isAuthenticate", adminAuthController.isAuthenticated.bind(adminAuthController))
// adminRouter.post("/register",adminAuthController.adminRegister.bind(adminAuthController))

// Protected routes (middleware applied)
adminRouter.use(authMiddleware.authenticateToken.bind(authMiddleware))
adminRouter.post( "/logOut", adminAuthController.logOut.bind(adminAuthController))
adminRouter.get("/dashboard", adminDashboardController.getDashboardStats.bind(adminDashboardController))


/////////////////////////////////////////////////        Employee - Management          /////////////////////////////////////////////////////////////
adminRouter
.get("/employees", adminEmplController.getEmployee.bind(adminEmplController))
.post('/employees', adminEmplController.addEmployee.bind(adminEmplController))
.patch("/employees/:id", adminEmplController.blockEmployee.bind(adminEmplController))
.delete("/employees/:id",adminEmplController.deleteEmployee.bind(adminEmplController))


/////////////////////////////////////////////////        Client - Management          /////////////////////////////////////////////////////////////
adminRouter
.get("/clients", adminUserController.getUsers.bind(adminUserController))
.patch("/clients/:id", adminUserController.blockUser.bind(adminUserController))

export default adminRouter; 