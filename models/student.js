//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Require Multer Module for the File Uploading
const multer = require("multer");
//Require Path Module for the Directory
const path = require("path");
//The path where the files will be uploaded
const AVATAR_PATH = path.join("/uploads/students/avatars");

//Create the DB Schema
const studentSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: [3, "Name must be at least 3 Characters Long ❌"],
		},
		age: {
			type: Number,
			required: true,
			min: [1, "Age must be at least 1 Year Old ❌"],
			max: [100, "Age must be at most 100 Years Old ❌"],
		},
		gender: {
			type: String,
			required: true,
			lowercase: true,
			enum: ["male", "female", "other"],
		},
		college: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
		},
		status: {
			type: String,
			trim: true,
			lowercase: true,
			default: "not placed",
			enum: ["placed", "not placed"],
		},
		enrolments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Enrolment",
			},
		],
		interviews: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Interview",
			},
		],
		scores: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Score",
			},
		],
		results: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Result",
			},
		],
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
studentSchema.statics.uploadedFile = multer({
	storage: storage,
	fileFilter: fileTypeFilter,
}).single("student_avatar");

//Static Variable :: AVATAR_PATH should be available globally in the STUDENT Model
fileSchema.statics.filePath = AVATAR_PATH;

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Student = mongoose.model("Student", studentSchema);

//Export the Model/Collection
module.exports = Student;

// ------------- Prebuilt / Inbuilt MongoDB Validators -------------
//Predefined MongoDB Validate Function
// validate: {
// 	//Predefined MongoDB Validators
// 	validator: function (value) {
// 		return value.length >= 6;
// 	},
// 	message: "Password should be at least 6 characters long",
// },
// ------------- Prebuilt / Inbuilt MongoDB Validators -------------
