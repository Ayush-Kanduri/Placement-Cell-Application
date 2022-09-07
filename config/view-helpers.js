//Require the Environment File for getting the Environment Variables
const env = require("./environment");
//Require the File System Module for the Directory
const fs = require("fs");
//Require the Path Module for the Directory
const path = require("path");

//------------Export the View Helpers------------
//View Helpers Function :: A Global Function which will be present throughout the App. It will take an App as an argument because we are sending the function to the Locals of the App. It will receive an Express App Instance.
module.exports = (app) => {
	//Locals Function :: Setting a function "assetPath(filePath)" inside the Locals of the App. This function will take a file path as an argument and will return the file path with the "asset" or "public" directory path.
	app.locals.assetPath = (filePath) => {
		if (env.name === "development") return "/" + filePath;

		//Returning the File Path with the "public" directory path
		return (
			"/" +
			//Parsing the JSON Manifest File
			JSON.parse(
				//Synchronized reading of the Manifest File
				fs.readFileSync(
					path.join(__dirname, "../public/assets/rev-manifest.json")
				)
			)[filePath]
		);
	};
};
//-----------------------------------------------
