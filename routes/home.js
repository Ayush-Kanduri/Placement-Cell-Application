//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();
//Require the Passport Module
const passport = require("passport");
//Requires the Passport Local Strategy Module
const passportLocal = require("../config/passport-local-strategy");
//Requires the BEValidation Middleware Module
const { BEValidation } = require("../config/middleware");

//Require Home Controller
const homeController = require("../controllers/home_controller");

//Access the Home Controller's homepage() Function @ '/' route.
router.get("/", homeController.homepage);
//Access the Home Controller's signup() Function @ '/signup' route.
router.get("/signup", homeController.signup);
//Access the Home Controller's createUser() Function @ '/create-user' route.
router.post(
	"/create-user",
	BEValidation("createUser"),
	homeController.createUser
);
//Access the Home Controller's createSession() Function @ '/create-session' route.
router.post(
	"/create-session",
	passport.authenticate(
		"local", //Strategy to be used for authentication
		{ failureRedirect: "/" } //Failure Redirect URL
	),
	homeController.createSession
);
//Access the Home Controller's destroySession() Function @ '/destroy-session' route.
router.get("/destroy-session", homeController.destroySession);
//Access the Home Controller's profile() Function @ '/profile/:id' route.
router.get(
	"/profile/:id",
	passport.checkAuthentication,
	homeController.profile
);
//Access the Home Controller's update() Function @ '/update/:id' route.
router.post("/update/:id", passport.checkAuthentication, homeController.update);
//Access the Google's OAuth-2.0 Strategy's authenticate() Function @ '/auth/google' route.
router.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);
//Access the Google's OAuth-2.0 Strategy's authenticate() Function @ '/auth/google/callback' route.
router.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/" }),
	homeController.createSession
);

//Export the Router
module.exports = router;
