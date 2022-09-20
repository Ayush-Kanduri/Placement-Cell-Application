//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Create the DB Schema
const interviewSchema = new mongoose.Schema(
	{
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
		},
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Student",
		},
		result: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Result",
		},
	},
	{
		timestamps: true,
	}
);

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Interview = mongoose.model("Interview", interviewSchema);

//Export the Model
module.exports = Interview;
