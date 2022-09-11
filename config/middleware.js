//Require Path Module
const path = require("path");
//Require File System Module
const fs = require("fs");

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

		directory = path.join(__dirname, "..", "/uploads/students");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);

		directory = path.join(__dirname, "..", "/uploads/students/avatars");
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
	console.log(obj);

	//Return Format
	// const { DBValidation } = require("./config/middleware");
	// return DBValidation(req, res, err);

	return res.json(obj);
};

//Sets the Flash Message into the Locals of the Response Body
module.exports.setFlash = (req, res, next) => {
	res.locals.flash = {
		success: req.flash("success"),
		error: req.flash("error"),
	};
	next();
};
