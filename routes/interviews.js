//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();
//Require the Passport Module
const passport = require("passport");

//Require the Interviews Controller
const interviewsController = require("../controllers/interviews_controllers");

//Access the Interviews Controller's add() Function @ '/interviews/add' route.
router.post("/add", passport.checkAuthentication, interviewsController.add);

//Export the Router
module.exports = router;
