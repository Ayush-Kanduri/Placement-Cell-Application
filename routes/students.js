//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();
//Require the Passport Module
const passport = require("passport");

//Require the Students Controller
const studentsController = require("../controllers/students_controller");

//Access the Students Controller's add() Function @ '/students/add' route.
router.post("/add", passport.checkAuthentication, studentsController.add);
//Access the Students Controller's delete() Function @ '/students/delete/:id' route.
router.delete(
	"/delete/:id",
	passport.checkAuthentication,
	studentsController.delete
);

//Export the Router
module.exports = router;
