//Require the Student Model
const Student = require("../models/student");
//Require the Interview Model
const Interview = require("../models/interview");
//Require the Company Model
const Company = require("../models/company");
//Require the Result Model
const Result = require("../models/result");
//Require the Database Validation Middleware
const { DBValidation } = require("../config/middleware");

module.exports.add = async (req, res) => {
	try {
		let { company, date } = req.body;
		let COMPANY = await Company.findOne({
			name: company,
			date: date,
		});
		if (COMPANY) {
			return res.status(400).json({
				status: "error",
				message: "Interview Already Exists 🤷‍♂️",
			});
		}

		COMPANY = await Company.create({ name: company, date: date });

		let obj = {
			id: COMPANY._id,
			name: COMPANY.name,
			date: date,
		};

		//Send the response
		return res.status(200).json({
			status: "success",
			message: "Interview Created Successfully 🎊 🥳",
			company: obj,
		});
	} catch (error) {
		console.log(error);
		const obj = DBValidation(req, res, error);
		req.flash("error", obj.message);

		//Send the response
		return res.status(500).json({
			status: "error",
			message: obj.message,
			response: error,
			error: "Internal Server Error",
		});
	}
};

module.exports.delete = async (req, res) => {
	try {
		let company = await Company.findById(req.params.company);
		if (!company) {
			return res.status(400).json({
				status: "error",
				message: "Company Not Found 🤔",
			});
		}

		let interviews = await Interview.find({ company: company._id });
		if (interviews.length === 0) await company.remove();
		let results = await Result.find({ company: company._id });
		if (results.length === 0) await company.remove();

		await Student.updateMany(
			{ interviews: { $in: interviews } },
			{ $pull: { interviews: { $in: interviews } } }
		);

		await Company.updateMany(
			{ interviews: { $in: interviews } },
			{ $pull: { interviews: { $in: interviews } } }
		);

		await Student.updateMany(
			{ results: { $in: results } },
			{ $pull: { results: { $in: results } } }
		);

		await Company.updateMany(
			{ results: { $in: results } },
			{ $pull: { results: { $in: results } } }
		);

		await Interview.deleteMany({ company: company._id });
		await Result.deleteMany({ company: company._id });

		await company.remove();

		//Send the response
		return res.status(200).json({
			status: "success",
			message: "Interview Deleted Successfully 🎊 🥳",
		});
	} catch (error) {
		console.log(error);
		const obj = DBValidation(req, res, error);
		req.flash("error", obj.message);

		//Send the response
		return res.status(500).json({
			status: "error",
			message: obj.message,
			response: error,
			error: "Internal Server Error",
		});
	}
};

module.exports.addStudent = async (req, res) => {};

module.exports.editStudent = async (req, res) => {};

module.exports.deleteStudent = async (req, res) => {};
