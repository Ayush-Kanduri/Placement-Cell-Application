//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Create the DB Schema
const scoreSchema = new mongoose.Schema(
	{
		score: {
			type: Number,
			required: true,
		},
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Student",
		},
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		},
	},
	{
		timestamps: true,
	}
);

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Score = mongoose.model("Score", scoreSchema);

//Export the Model
module.exports = Score;
