import { Router } from "express";
import { adminAuthController } from "../controllers/management/adminController/authController";
import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { adminVenueController } from "../controllers/management/adminController/venueController";
import { adminSeatingController } from "../controllers/management/adminController/seatingController";

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

////////////////////////////////////////////////////////////////       VENUES          //////////////////////////////////////////////////////////////////
adminRouter.route("/venues")
  .post(adminVenueController.addVenue.bind(adminVenueController))
  .get(adminVenueController.getVenue.bind(adminVenueController));
adminRouter.route("/venues/:id")
  .put(adminVenueController.updateVenue.bind(adminVenueController))
  .delete(adminVenueController.deleteVenue.bind(adminVenueController));
adminRouter.patch("/venues/:id/status", adminVenueController.isList.bind(adminVenueController));

///////////////////////////////////////////////////////////////        SEATING        //////////////////////////////////////////////////////////////////
adminRouter.route("/seatings")
  .post(adminSeatingController.addSeating.bind(adminSeatingController))
  .get(adminSeatingController.getSeating.bind(adminSeatingController));
adminRouter.route("/seatings/:id")
  .put(adminSeatingController.updateSeating.bind(adminSeatingController))
  .delete(adminSeatingController.deleteSeating.bind(adminSeatingController))
adminRouter.patch("/seatings/:id/status", adminSeatingController.isList.bind(adminSeatingController));

//////////////////////////////////////////////////////////////         Food         ////////////////////////////////////////////////////////////////////
adminRouter.route("/seatings")
  .post(adminSeatingController.addSeating.bind(adminSeatingController))
  .get(adminSeatingController.getSeating.bind(adminSeatingController));
adminRouter.route("/seatings/:id")
  .put(adminSeatingController.updateSeating.bind(adminSeatingController))
  .delete(adminSeatingController.deleteSeating.bind(adminSeatingController))
adminRouter.patch("/seatings/:id/status", adminSeatingController.isList.bind(adminSeatingController));

export default adminRouter;
