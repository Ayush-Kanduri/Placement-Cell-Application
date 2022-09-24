//Require the Student Model
const Student = require("../models/student");
//Require the Interview Model
const Interview = require("../models/interview");
//Require the Company Model
const Company = require("../models/company");
//Require the Result Model
const Result = require("../models/result");
//Require Mongoose Library
const mongoose = require("mongoose");
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
			message: "Company Visit Scheduled Successfully 🎊 🥳",
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

module.exports.deleteInterview = async (req, res) => {
	try {
		const CHECK = mongoose.Types.ObjectId.isValid(req.params.id);
		if (!CHECK) {
			return res.status(200).json({
				status: "error",
				message:
					"Something Went Wrong with your Browser. Please Refresh the Page 🤷‍♂️",
			});
		}

		let interview = await Interview.findById(req.params.id);
		if (!interview) {
			return res.status(200).json({
				status: "error",
				message: "Interview Not Found 🤷‍♂️",
			});
		}

		let company = await Company.findById(interview.company);
		if (!company) {
			return res.status(200).json({
				status: "error",
				message: "Company Not Found 🤷‍♂️",
			});
		}

		company.interviews.pull(interview._id);
		await company.save();
		await interview.remove();
		// OR
		// let index = company.interviews.indexOf(interview._id);
		// company.interviews.splice(index, 1);
		// await company.save();
		// await interview.remove();

		//Send the response
		return res.status(200).json({
			status: "success",
			message: "Empty Interview Slot Deleted Successfully 🎊 🥳",
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
		const CHECK = mongoose.Types.ObjectId.isValid(req.body.id);
		if (!CHECK) {
			return res.status(200).json({
				status: "error",
				message:
					"Something Went Wrong with your Browser. Please Refresh the Page 🤷‍♂️",
			});
		}

		let company = await Company.findById(req.body.id);
		if (!company) {
			return res.status(200).json({
				status: "error",
				message: "Company Not Found 🤷‍♂️",
			});
		}

		//To stop creating unnecessary interview slots
		let students = await Student.find({});
		if (students.length === 0) {
			return res.status(200).json({
				status: "error",
				message: "No Students Found 🤷‍♂️",
			});
		}

		//To stop creating unnecessary interview slots
		let interviews = await Interview.find({ company: company._id });
		if (interviews.length >= students.length) {
			return res.status(200).json({
				status: "error",
				message: "Please create more students to add 🤷‍♂️",
			});
		}

		let interview = await Interview.create({ company: company._id });
		company.interviews.push(interview._id);
		await company.save();

		//Send the response
		return res.status(200).json({
			status: "success",
			message: "Empty Interview Slot Created Successfully 🎊 🥳",
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
		const CHECK = mongoose.Types.ObjectId.isValid(req.params.company);
		if (!CHECK) {
			return res.status(200).json({
				status: "error",
				message:
					"Something Went Wrong with your Browser. Please Refresh the Page 🤷‍♂️",
			});
		}

		let company = await Company.findById(req.params.company);
		if (!company) {
			return res.status(200).json({
				status: "error",
				message: "Company Not Found 🤷‍♂️",
			});
		}

		let interviews = await Interview.find({ company: company._id });
		if (interviews.length === 0) {
			await company.remove();
			return res.status(200).json({
				status: "success",
				message: "Company Visit Cancelled Successfully 🎊 🥳",
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
				message: "Company Visit Cancelled Successfully 🎊 🥳",
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
			message: "Company Visit Cancelled Successfully 🎊 🥳",
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
		const CHECK1 = mongoose.Types.ObjectId.isValid(req.body.name);
		const CHECK2 = mongoose.Types.ObjectId.isValid(req.body.interviewID);
		if (!CHECK1 || !CHECK2) {
			return res.status(200).json({
				status: "error",
				message:
					"Something Went Wrong with your Browser. Please Refresh the Page 🤷‍♂️",
			});
		}

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

module.exports.editStudent = async (req, res) => {
	try {
		const CHECK = mongoose.Types.ObjectId.isValid(req.body.interviewID);
		if (!CHECK) {
			return res.status(200).json({
				status: "error",
				message:
					"Something Went Wrong with your Browser. Please Refresh the Page 🤷‍♂️",
			});
		}

		let { result, interviewID } = req.body;
		let interview = await Interview.findById(interviewID);
		if (!interview) {
			return res.status(200).json({
				status: "error",
				message: "Interview Not Found 🤷‍♂️",
			});
		}

		let student = await Student.findById(interview.student).populate(
			"results"
		);
		if (!student) {
			return res.status(200).json({
				status: "error",
				message: "Student Not Found 🤷‍♂️",
			});
		}

		let RESULT = await Result.findOne({
			student: student._id,
			company: interview.company,
		});

		if (!RESULT) {
			return res.status(200).json({
				status: "error",
				message: "Student Not Found in the Interview List 🤷‍♂️",
			});
		}

		RESULT.result = result;
		await RESULT.save();

		if (result === "pass") {
			student.status = "placed";
			await student.save();
		}

		if (result !== "pass") {
			let RES = await Result.find({ student: student._id });
			let flag = 0;
			for (let R of RES) {
				if (R.result === "pass") {
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
			message: "Student Updated Successfully 🎊 🥳",
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

module.exports.deleteStudent = async (req, res) => {
	try {
		const CHECK = mongoose.Types.ObjectId.isValid(req.params.interview);
		if (!CHECK) {
			return res.status(200).json({
				status: "error",
				message:
					"Something Went Wrong with your Browser. Please Refresh the Page 🤷‍♂️",
			});
		}

		let { interview } = req.params;
		let interviewID = interview;
		interview = await Interview.findById(interviewID);
		if (!interview) {
			return res.status(200).json({
				status: "error",
				message: "Interview Not Found 🤷‍♂️",
			});
		}

		let result = await Result.findById(interview.result);
		if (!result) {
			return res.status(200).json({
				status: "error",
				message: "Result Not Found 🤷‍♂️",
			});
		}

		let student = await Student.findById(interview.student).populate(
			"results"
		);
		if (!student) {
			return res.status(200).json({
				status: "error",
				message: "Student Not Found 🤷‍♂️",
			});
		}

		let company = await Company.findById(interview.company);
		if (!company) {
			return res.status(200).json({
				status: "error",
				message: "Company Not Found 🤷‍♂️",
			});
		}

		student.results.pull(result._id);
		await student.save();
		student.interviews.pull(interview._id);
		await student.save();
		company.results.pull(result._id);
		await company.save();
		company.interviews.pull(interview._id);
		await company.save();
		await interview.remove();
		await result.remove();

		let RESULTS = await Result.find({ student: student._id });
		if (RESULTS.length === 0) {
			student.status = "not placed";
			await student.save();
		} else {
			let flag = 0;
			for (let R of RESULTS) {
				if (R.result === "pass") {
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

		let COMPANY = await Company.findById(interview.company).populate({
			path: "results",
			populate: [
				{
					path: "student",
				},
			],
		});

		student = await Student.findById(student._id).populate("results");
		let students = await Student.find({});
		//Send the response
		return res.status(200).json({
			status: "success",
			message: "Student Deleted from the Interview List Successfully 🎊 🥳",
			student: student,
			company: COMPANY,
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
