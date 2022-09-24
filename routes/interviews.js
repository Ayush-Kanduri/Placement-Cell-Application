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
//Access the Interviews Controller's createInterview() Function @ '/interviews/createInterview' route.
router.post(
	"/create-interview",
	passport.checkAuthentication,
	interviewsController.createInterview
);
//Access the Interviews Controller's deleteInterview() Function @ '/interviews/delete-interview/:id' route.
router.delete(
	"/delete-interview/:id",
	passport.checkAuthentication,
	interviewsController.deleteInterview
);
//Access the Interviews Controller's delete() Function @ '/interviews/delete/:company' route.
router.delete(
	"/delete/:company",
	passport.checkAuthentication,
	interviewsController.delete
);
//Access the Interviews Controller's addStudent() Function @ '/interviews/students/add' route.
router.post(
	"/students/add",
	passport.checkAuthentication,
	interviewsController.addStudent
);
//Access the Interviews Controller's editStudent() Function @ '/interviews/students/edit/:interview' route.
router.put(
	"/students/edit/:interview",
	passport.checkAuthentication,
	interviewsController.editStudent
);
//Access the Interviews Controller's deleteStudent() Function @ '/interviews/students/delete/:interview' route.
router.delete(
	"/students/delete/:interview",
	passport.checkAuthentication,
	interviewsController.deleteStudent
);

//Export the Router
module.exports = router;
