//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();
//Require the Passport Module
const passport = require("passport");

//Require Jobs Controller
const jobsController = require("../controllers/jobs_controller");

//Access the Jobs Controller's portal() Function @ '/' route.
router.get("/", passport.checkAuthentication, jobsController.portal);

//Export the Router
module.exports = router;
