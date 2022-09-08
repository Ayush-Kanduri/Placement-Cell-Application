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

		directory = path.join(__dirname, "..", "/workers");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);
	} catch (error) {
		console.log(error);
	}
	next();
};
