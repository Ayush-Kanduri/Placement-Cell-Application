//Require Express Module for running the Express Server
const express = require("express");
//Create Express App for Request-Response Cycle & to create the Express Server
const app = express();
//Create Express Server Port
const port = process.env.PORT || 8000;
//Require the DotEnv Library
const dotenv = require("dotenv").config();
//Require the CORS Module for allowing Cross-Origin Requests
const cors = require("cors");
//Require the Morgan Module for Logging
const logger = require("morgan");
//Require the Environment File for getting the Environment Variables 
const env = require("./config/environment");

//Middleware - CORS
app.use(cors());
//Middleware - URL Encoder
app.use(express.urlencoded({ extended: true }));
//Middleware - JSON Encoder
app.use(express.json());
//Middleware - Morgan used for Logging
app.use(logger(env.morgan.mode, env.morgan.options));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

//Run the ExpressJS Server
app.listen(port, (err) => {
	if (err) return console.log("Error: ", err);
	console.log(`Server is running successfully on port ${port}`);
});
