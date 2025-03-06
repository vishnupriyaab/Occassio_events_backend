import { Router } from "express";
import { adminAuthController } from "../controllers/management/adminController/authController";
import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { adminVenueController } from "../controllers/management/adminController/venueController";

const adminRouter = Router();
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("admin", iJwtServices);

//private - routes
adminRouter.post("/login", adminAuthController.adminLogin.bind(adminAuthController));

// Protected routes (middleware applied)
adminRouter.use(authMiddleware.authenticateToken.bind(authMiddleware));
adminRouter
    .post( "/logOut", adminAuthController.logOut.bind(adminAuthController))
    .post('/venues',adminVenueController.addVenue.bind(adminVenueController))
    .get('/venues',adminVenueController.getVenue.bind(adminVenueController))
    .put('/venues/:id',adminVenueController.updateVenue.bind(adminVenueController))

export default adminRouter;
