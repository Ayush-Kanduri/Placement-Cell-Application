//Require Path Module
const path = require("path");
//Require File System Module
const fs = require("fs");
//Require Body Module from Express Validator
const { body } = require("express-validator");
//Require the Environment File for getting the Environment Variables
const env = require("./environment");

//Create Folders if they don't exist
module.exports.createFolders = async (req, res, next) => {
	try {
		let directory = path.join(__dirname, "..", "/mailers");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);

		directory = path.join(__dirname, "..", "/storage");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);

		directory = path.join(__dirname, "..", "/uploads");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);

		directory = path.join(__dirname, "..", "/uploads/employees");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);

		directory = path.join(__dirname, "..", "/uploads/employees/avatars");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);

		directory = path.join(__dirname, "..", "/uploads/reports");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);

		directory = path.join(__dirname, "..", "/workers");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);
	} catch (error) {
		console.log(error);
	}
	next();
};

//Handles the MongoDB Validation Errors
module.exports.DBValidation = (req, res, err) => {
	let error = "Error";
	let code = "Unknown";
	let index = 0;

	if (!err.code) {
		index = err.message.lastIndexOf(":");
		error = err.message.substr(index + 2);
		code = "No Code";
	} else {
		index = err.message.indexOf(":");
		error = err.message.substr(0, index);
		code = err.code;
	}

	let obj = {
		type: "Database",
		name: err.name,
		message: error,
		code: code,
	};

	return obj; //return res.json(obj);
};

//Sets the Flash Message into the Locals of the Response Body
module.exports.setFlash = (req, res, next) => {
	res.locals.flash = {
		success: req.flash("success"),
		error: req.flash("error"),
	};
	next();
};

//BACKEND VALIDATION :: Validates the Sign Up Form Data at the router level before sending it to DB
module.exports.BEValidation = (method) => {
	switch (method) {
		case "createUser": {
			return [
				body("email", "Email is Invalid ❌").exists().isEmail(),
				body("password", "Password must be at least 6 Characters Long ❌")
					.exists()
					.isLength({ min: 6 }),
				body("name", "Name must be at least 3 Characters Long ❌")
					.exists()
					.isLength({ min: 3 }),
			];
		}
	}
};

//Path Finder Function :: Finds the Path of the Static File
module.exports.pathFinder = (link) => {
	if (env.name === "development") return "/" + link;
	return (
		"/" +
		JSON.parse(
			fs.readFileSync(
				path.join(__dirname, "../public/assets/rev-manifest.json")
			)
		)[link]
	);
};
