//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();
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

//Export the Router
module.exports = router;
