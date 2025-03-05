import { Router } from "express";
import { adminAuthController } from "../controllers/management/adminController/authController";

const adminRouter = Router();


adminRouter.post("/login", adminAuthController.adminLogin.bind(adminAuthController));

export default adminRouter;
