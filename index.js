//Require the Express Module for running the Express Server
const express = require("express");
//Create Express App for Request-Response Cycle & to create the Express Server
const app = express();
//Create Express Server Port
const port = process.env.PORT || 8000;
//Require the Path Module for the Directory
const path = require("path");
//Require the File System Module for the Directory
const fs = require("fs");
//Require the DotEnv Library
const dotenv = require("dotenv").config();
//Require the CORS Module for allowing Cross-Origin Requests
const cors = require("cors");
//Requires the Express-EJS-Layouts Module
const expressLayouts = require("express-ejs-layouts");
//Requires the EJS Module
const ejs = require("ejs");
//Require the Morgan Module for Logging
const logger = require("morgan");
//Require the View Helpers
const viewHelpers = require("./config/view-helpers")(app);
//Require the Environment File for getting the Environment Variables
const env = require("./config/environment");
//Requires the index.js - Route File, from the Routes Folder.
const route = require("./routes/index");

//Middleware - CORS
app.use(cors());
//Middleware - URL Encoder
app.use(express.urlencoded({ extended: true }));
//Middleware - JSON Encoder
app.use(express.json());
//Middleware - Express App uses Static Files in the Assets Folder
app.use(express.static(env.asset_path));
//Middleware - Express App uses expressLayouts to tell that the views which are going to be rendered belongs to some layout.
app.use(expressLayouts);
//Middleware - Morgan used for Logging
app.use(logger(env.morgan.mode, env.morgan.options));

//Set Up - Extract Styles from Sub Pages into the Layout.
app.set("layout extractStyles", true);
//Set Up - Extract Scripts from Sub Pages into the Layout.
app.set("layout extractScripts", true);
//Set Up - Template Engine as EJS
app.set("view engine", "ejs");
//Set Up - Template Engine Views Folder Path (..../views)
app.set("views", path.join(__dirname, "views"));

//Middleware - App calls index.js - Route File, whenever '/' route is called in the request.
app.use("/", route);

//Run the ExpressJS Server
app.listen(port, (err) => {
	if (err) return console.log("Error: ", err);
	console.log(`Server is running successfully on port ${port}`);
});
