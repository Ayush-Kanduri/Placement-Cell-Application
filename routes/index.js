//Require the existing Express
const express = require("express");
//Create an Index Router
const router = express.Router();

//Require the Home Router
const homeRouter = require("./home");

//Use the Home Router
router.use("/", homeRouter);

//Export the Index Router
module.exports = router;