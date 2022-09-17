//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Create the DB Schema
const courseSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			enum: ["data structures & algorithms", "web development", "react"],
		},
		enrolments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Enrolment",
			},
		],
		scores: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Score",
			},
		],
	},
	{
		timestamps: true,
	}
);

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Course = mongoose.model("Course", courseSchema);

//Export the Model
module.exports = Course;
