//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();
//Require the Passport Module
const passport = require("passport");

//Require Downloads Controller
const downloadsController = require("../controllers/downloads_controller");

//Access the Downloads Controller's downloadReport() Function @ '/report' route.
router.get(
	"/",
	passport.checkAuthentication,
	downloadsController.downloadReport
);

//Export the Router
module.exports = router;
