//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");
//Require ValidatorJS for the Validation
const validator = require("validator");

//Require Multer Module for the File Uploading
const multer = require("multer");
//Require Path Module for the Directory
const path = require("path");
//The path where the files will be uploaded
const AVATAR_PATH = path.join("/uploads/employees/avatars");

//Create the DB Schema
const employeeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: [3, "Name must be at least 3 Characters Long ❌"],
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate(value) {
				//Validation using ValidatorJS
				if (!validator.isEmail(value)) {
					throw new Error("Email is Invalid ❌");
				}
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				//Predefined / Inbuilt MongoDB Validate Function
				if (value.length < 6) {
					const message = "Password must be at least 6 Characters Long ❌";
					throw new Error(message);
				}
			},
		},
		avatarPath: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

//BACKEND VALIDATION :: Filter Function for Avatar Uploading
const fileTypeFilter = (req, file, cb) => {
	//Accept the file if it is an Image & less than 3MB
	const allowedTypes = [
		"image/jpeg",
		"image/png",
		"image/jpg",
		"image/gif",
		"image/svg",
	];
	const sizeError = "File is too large, Max size is 3MB ❌";
	const typeError = "File Type is not Supported ❌";

	if (allowedTypes.includes(file.mimetype)) {
		if (file.size > 1024 * 1024 * 3) cb(new Error(sizeError), false);
		else cb(null, true);
	} else {
		cb(new Error(typeError), false);
	}
};

//Setting up the Disk Storage Engine
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "..", AVATAR_PATH));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

//Static Function :: Attaching the Disk Storage Engine to the Multer
employeeSchema.statics.uploadedFile = multer({
	storage: storage,
	fileFilter: fileTypeFilter,
}).single("avatar");

//Static Variable :: AVATAR_PATH should be available globally in the EMPLOYEE Model
employeeSchema.statics.filePath = AVATAR_PATH;

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Employee = mongoose.model("Employee", employeeSchema);

//Export the Model
module.exports = Employee;
