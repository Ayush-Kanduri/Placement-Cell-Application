//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Create the DB Schema
const enrolmentSchema = new mongoose.Schema(
	{
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		},
		batch: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Batch",
		},
	},
	{
		timestamps: true,
	}
);

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Enrolment = mongoose.model("Enrolment", enrolmentSchema);

//Export the Model
module.exports = Enrolment;
