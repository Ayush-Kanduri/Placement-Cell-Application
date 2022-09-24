//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

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
			default: "not placed",
			trim: true,
			lowercase: true,
			enum: ["placed", "not placed"],
		},
		batch: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Batch",
		},
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
		avatar: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

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
