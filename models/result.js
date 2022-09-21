//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Create the DB Schema
const resultSchema = new mongoose.Schema(
	{
		result: {
			type: String,
			trim: true,
			required: true,
			lowercase: true,
			enum: ["pass", "fail", "on hold", "not attended", "to be decided"],
		},
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Student",
		},
		interview: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Interview",
		},
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
		},
	},
	{
		timestamps: true,
	}
);

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Result = mongoose.model("Result", resultSchema);

//Export the Model
module.exports = Result;
