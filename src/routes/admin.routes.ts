import { Router } from "express";
import { adminAuthController } from "../controllers/management/adminController/authController";
import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { adminVenueController } from "../controllers/management/adminController/venueController";
import { adminSeatingController } from "../controllers/management/adminController/seatingController";
import { adminFoodController } from "../controllers/management/adminController/foodController";
import { admindecorationController } from "../controllers/management/adminController/decorationController";
import { adminSoundController } from "../controllers/management/adminController/soundController";
import { adminPhotoController } from "../controllers/management/adminController/photoController";
import { adminMiscellaneousController } from "../controllers/management/adminController/miscellaneousController";

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
adminRouter.route("/food")
  .post(adminFoodController.addFood.bind(adminFoodController))
  .get(adminFoodController.getFood.bind(adminFoodController));
adminRouter.route("/food/:id")
  .put(adminFoodController.updateFood.bind(adminFoodController))
  .delete(adminFoodController.deleteFood.bind(adminFoodController))
adminRouter.patch("/food/:id/status", adminFoodController.isList.bind(adminFoodController));

/////////////////////////////////////////////////////////////       Decoration      ///////////////////////////////////////////////////////////////////
adminRouter.route("/decoration")
  .post(admindecorationController.addDecoration.bind(admindecorationController))
  .get(admindecorationController.getDecorations.bind(admindecorationController))
adminRouter.route("/decoration/:id")
  .put(admindecorationController.updateDecoration.bind(admindecorationController))
  .delete(admindecorationController.deleteDecoration.bind(admindecorationController))
adminRouter.patch("/decoration/:id/status", admindecorationController.isList.bind(admindecorationController));

//////////////////////////////////////////////////////////    Sound & Entertainment    /////////////////////////////////////////////////////////////////
adminRouter.route("/sound")
  .post(adminSoundController.addSound.bind(adminSoundController))
  .get(adminSoundController.getSounds.bind(adminSoundController))
adminRouter.route("/sound/:id")
  .put(adminSoundController.updateSound.bind(adminSoundController))
  .delete(adminSoundController.deleteSound.bind(adminSoundController))
adminRouter.patch("/sound/:id/status", adminSoundController.isList.bind(adminSoundController));

/////////////////////////////////////////////////////////      Photo & Video        ///////////////////////////////////////////////////////////////////
adminRouter.route("/photo")
  .post(adminPhotoController.addPhoto.bind(adminPhotoController))
  .get(adminPhotoController.getPhotos.bind(adminPhotoController))
adminRouter.route("/photo/:id")
  .put(adminPhotoController.updatePhoto.bind(adminPhotoController))
  .delete(adminPhotoController.deletePhoto.bind(adminPhotoController))
adminRouter.patch("/photo/:id/status", adminPhotoController.isList.bind(adminPhotoController));

/////////////////////////////////////////////////////////      Miscellaneous       //////////////////////////////////////////////////////////////////
adminRouter.route("/miscellaneous")
  .post(adminMiscellaneousController.addMiscellaneous.bind(adminMiscellaneousController))
  .get(adminMiscellaneousController.getMiscellaneous.bind(adminMiscellaneousController))
adminRouter.route("/miscellaneous/:id")
  .put(adminMiscellaneousController.updateMiscellaneous.bind(adminMiscellaneousController))
  .delete(adminMiscellaneousController.deleteMiscellaneous.bind(adminMiscellaneousController))
adminRouter.patch("/miscellaneous/:id/status", adminMiscellaneousController.isList.bind(adminMiscellaneousController));

export default adminRouter;