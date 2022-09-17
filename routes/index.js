//Require the existing Express
const express = require("express");
//Create an Index Router
const router = express.Router();

//Require the Home Router
const homeRouter = require("./home");
//Require the Jobs Router
const jobsRouter = require("./jobs");
//Require the Downloads Router
const downloadsRouter = require("./downloads");
//Require the Students Router
const studentsRouter = require("./students");
//Require the Interviews Router
const interviewsRouter = require("./interviews");

//Use the Home Router
router.use("/", homeRouter);
//Use the Jobs Router
router.use("/jobs", jobsRouter);
//Use the Downloads Router
router.use("/report", downloadsRouter);
//Use the Students Router
router.use("/students", studentsRouter);
//Use the Interviews Router
router.use("/interviews", interviewsRouter);

//Export the Index Router
module.exports = router;
