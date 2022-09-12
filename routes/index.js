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

//Use the Home Router
router.use("/", homeRouter);
//Use the Jobs Router
router.use("/jobs", jobsRouter);
//Use the Downloads Router
router.use("/report", downloadsRouter);

//Export the Index Router
module.exports = router;
