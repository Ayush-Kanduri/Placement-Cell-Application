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

//Creates a New Company Visit
module.exports.add = async (req, res) => {
	try {
		let { company, date } = req.body;
		let COMPANY = await Company.findOne({
			name: company,
			date: date,
		});
		//If the company is already added
		if (COMPANY) {
			return res.status(200).json({
				status: "error",
				message: "Interview Already Exists 🤷‍♂️",
			});
		}

		//Create a new Company
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

//Delete Empty Interview Slot
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
		//If the interview is not found
		if (!interview) {
			return res.status(200).json({
				status: "error",
				message: "Interview Not Found 🤷‍♂️",
			});
		}

		let company = await Company.findById(interview.company);
		//If the company is not found
		if (!company) {
			return res.status(200).json({
				status: "error",
				message: "Company Not Found 🤷‍♂️",
			});
		}

		//Update the company & delete the interview slot
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

//Create a new interview slot
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

		//Find the company
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

		//Create a new interview slot
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

//Delete the interview slot
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

		//Find the company
		let company = await Company.findById(req.params.company);
		if (!company) {
			return res.status(200).json({
				status: "error",
				message: "Company Not Found 🤷‍♂️",
			});
		}

		//Find the interview slots
		let interviews = await Interview.find({ company: company._id });
		//If the interview slots are not found
		if (interviews.length === 0) {
			await company.remove();
			return res.status(200).json({
				status: "success",
				message: "Company Visit Cancelled Successfully 🎊 🥳",
				students: [],
				id: req.params.company,
			});
		}

		//Find the result of the interview slots
		let results = await Result.find({ company: company._id });
		//If the results are not found
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

		//Find the students
		let students = await Student.find({ results: { $in: results } }).populate(
			"results"
		);
		//If there are no students results then mark the students not placed
		students.forEach(async (student) => {
			if (student.results.length <= 1) {
				student.status = "not placed";
				await student.save();
			}
		});

		//Delete the interview slots
		await Student.updateMany(
			{ interviews: { $in: interviews } },
			{ $pull: { interviews: { $in: interviews } } }
		);

		//Delete the interview slots
		await Company.updateMany(
			{ interviews: { $in: interviews } },
			{ $pull: { interviews: { $in: interviews } } }
		);

		//Delete the results
		await Student.updateMany(
			{ results: { $in: results } },
			{ $pull: { results: { $in: results } } }
		);

		//Delete the results
		await Company.updateMany(
			{ results: { $in: results } },
			{ $pull: { results: { $in: results } } }
		);

		//Delete the interview slots
		await Interview.deleteMany({ company: company._id });
		//Delete the results
		await Result.deleteMany({ company: company._id });

		//Delete the company
		await company.remove();

		//Find the students not in that company
		let stud = await Student.find({
			$and: [
				{ "interviews.company": { $ne: req.params.company } },
				{ _id: { $in: students } },
			],
		}).populate("results");

		for (let student of stud) {
			let flag = 0;
			//If student's result is pass then mark him placed
			for (let result of student.results) {
				if (result.result === "pass") {
					student.status = "placed";
					await student.save();
					flag = 1;
					break;
				}
			}
			//If student's result is not pass then mark him not placed
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

//Add student to the interview slot
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
		//If the student is not found
		if (!student) {
			return res.status(200).json({
				status: "error",
				message: "Student Not Found 🤷‍♂️",
			});
		}

		//Find the interview slot
		let interview = await Interview.findById(interviewID);
		if (!interview) {
			return res.status(200).json({
				status: "error",
				message: "Interview Not Found 🤷‍♂️",
			});
		}

		//Find the result of the interview slot
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
		//If the result is not found then create a new result
		if (!RESULT) {
			//If the result is pass then mark the student placed
			if (result === "pass") {
				student.status = "placed";
				await student.save();
			}
			//Create a new result
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

//Edit the result of the student in the interview slot
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
		//Find the interview slot
		let interview = await Interview.findById(interviewID);
		if (!interview) {
			return res.status(200).json({
				status: "error",
				message: "Interview Not Found 🤷‍♂️",
			});
		}

		//Find the student
		let student = await Student.findById(interview.student).populate(
			"results"
		);
		if (!student) {
			return res.status(200).json({
				status: "error",
				message: "Student Not Found 🤷‍♂️",
			});
		}

		//Find the result of the interview slot
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

		//If the result is pass then mark the student placed
		if (result === "pass") {
			student.status = "placed";
			await student.save();
		}

		//If the result is not pass
		if (result !== "pass") {
			let RES = await Result.find({ student: student._id });
			let flag = 0;
			for (let R of RES) {
				//If the result is pass then mark the student placed
				if (R.result === "pass") {
					student.status = "placed";
					await student.save();
					flag = 1;
					break;
				}
			}
			//If the result is not pass then mark the student not placed
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

//Delete the student from the interview slot
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
		//Find the interview slot
		interview = await Interview.findById(interviewID);
		if (!interview) {
			return res.status(200).json({
				status: "error",
				message: "Interview Not Found 🤷‍♂️",
			});
		}

		//Find the result of the interview slot
		let result = await Result.findById(interview.result);
		if (!result) {
			return res.status(200).json({
				status: "error",
				message: "Result Not Found 🤷‍♂️",
			});
		}

		//Find the student
		let student = await Student.findById(interview.student).populate(
			"results"
		);
		if (!student) {
			return res.status(200).json({
				status: "error",
				message: "Student Not Found 🤷‍♂️",
			});
		}

		//Find the company
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
		//If there are no results then mark the student not placed
		if (RESULTS.length === 0) {
			student.status = "not placed";
			await student.save();
		} else {
			let flag = 0;
			for (let R of RESULTS) {
				//If the result is pass then mark the student placed
				if (R.result === "pass") {
					student.status = "placed";
					await student.save();
					flag = 1;
					break;
				}
			}
			//If the result is not pass then mark the student not placed
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
