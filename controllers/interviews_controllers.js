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
const { result } = require("lodash");

module.exports.add = async (req, res) => {
	try {
		let { company, date } = req.body;
		let COMPANY = await Company.findOne({
			name: company,
			date: date,
		});
		if (COMPANY) {
			return res.status(200).json({
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

module.exports.createInterview = async (req, res) => {
	try {
		let company = await Company.findById(req.body.id);
		if (!company) {
			return res.status(200).json({
				status: "error",
				message: "Company Not Found 🤷‍♂️",
			});
		}

		let students = await Student.find({});
		if (students.length === 0) {
			return res.status(200).json({
				status: "error",
				message: "No Students Found 🤷‍♂️",
			});
		}

		let interview = await Interview.create({ company: company._id });
		company.interviews.push(interview._id);
		await company.save();

		//Send the response
		return res.status(200).json({
			status: "success",
			message: "Kindly Add Student & Result to the Interview 🚀",
			interview: interview,
			company: company,
			students: students,
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
			return res.status(200).json({
				status: "error",
				message: "Company Not Found 🤷‍♂️",
			});
		}

		let interviews = await Interview.find({ company: company._id });
		if (interviews.length === 0) {
			let students = await Student.find({});
			await company.remove();
			return res.status(200).json({
				status: "success",
				message: "Interview Deleted Successfully 🎊 🥳",
				students: [],
				id: req.params.company,
			});
		}

		let results = await Result.find({ company: company._id });
		if (results.length === 0) {
			await Student.updateMany(
				{ interviews: { $in: interviews } },
				{ $pull: { interviews: { $in: interviews } } }
			);
			await Company.updateMany(
				{ interviews: { $in: interviews } },
				{ $pull: { interviews: { $in: interviews } } }
			);
			await Interview.deleteMany({ company: company._id });
			await company.remove();
			//Send the response
			return res.status(200).json({
				status: "success",
				message: "Interview Deleted Successfully 🎊 🥳",
				students: [],
				id: req.params.company,
			});
		}

		let students = await Student.find({ results: { $in: results } }).populate(
			"results"
		);
		students.forEach(async (student) => {
			if (student.results.length <= 1) {
				student.status = "not placed";
				await student.save();
			}
		});

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

		let stud = await Student.find({
			$and: [
				{ "interviews.company": { $ne: req.params.company } },
				{ _id: { $in: students } },
			],
		}).populate("results");

		for (let student of stud) {
			let flag = 0;
			for (let result of student.results) {
				if (result.result === "pass") {
					student.status = "placed";
					await student.save();
					flag = 1;
					break;
				}
			}
			if (flag === 0) {
				student.status = "not placed";
				await student.save();
			}
		}

		students = await Student.find({});

		//Send the response
		return res.status(200).json({
			status: "success",
			message: "Interview Deleted Successfully 🎊 🥳",
			students: students,
			id: req.params.company,
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

module.exports.addStudent = async (req, res) => {
	try {
		let { name, result, interviewID } = req.body;
		let student = await Student.findById(name);
		if (!student) {
			return res.status(200).json({
				status: "error",
				message: "Student Not Found 🤷‍♂️",
			});
		}

		let interview = await Interview.findById(interviewID);
		if (!interview) {
			return res.status(200).json({
				status: "error",
				message: "Interview Not Found 🤷‍♂️",
			});
		}

		let RESULT = await Result.findOne({
			student: student._id,
			company: interview.company,
		});
		if (RESULT) {
			return res.status(200).json({
				status: "error",
				message: "Student Already Added to the Interview 🤷‍♂️",
			});
		}
		if (!RESULT) {
			if (result === "pass") {
				student.status = "placed";
				await student.save();
			}
			RESULT = await Result.create({
				result: result,
				student: student._id,
				company: interview.company,
				interview: interview._id,
			});
		}

		interview.student = student._id;
		interview.result = RESULT._id;
		await interview.save();
		student.interviews.push(interview._id);
		student.results.push(RESULT._id);
		await student.save();
		let company = await Company.findById(interview.company);
		company.results.push(RESULT._id);
		await company.save();
		interview.company = company;
		await interview.save();
		RESULT.company = company;
		await RESULT.save();
		let students = await Student.find({});
		let COMPANY = await Company.findById(interview.company).populate({
			path: "results",
			populate: [
				{
					path: "student",
				},
			],
		});

		//Send the response
		return res.status(200).json({
			status: "success",
			message: "Student Added to the Interview List Successfully 🎊 🥳",
			student: student,
			interview: interview,
			students: students,
			result: RESULT,
			company: COMPANY,
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

module.exports.editStudent = async (req, res) => {};

module.exports.deleteStudent = async (req, res) => {};
