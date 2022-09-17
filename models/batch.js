//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Create the DB Schema
const batchSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		students: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Student",
			},
		],
		enrolments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Enrolment",
			},
		],
	},
	{
		timestamps: true,
	}
);

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Batch = mongoose.model("Batch", batchSchema);

//Export the Model
module.exports = Batch;
