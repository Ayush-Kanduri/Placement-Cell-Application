//Require the Student Model
const Student = require("../models/student");
//Require the Course Model
const Course = require("../models/course");
//Require the Batch Model
const Batch = require("../models/batch");
//Require the Enrolment Model
const Enrolment = require("../models/enrolment");
//Require the Interview Model
const Interview = require("../models/interview");
//Require the Score Model
const Score = require("../models/score");
//Require the Result Model
const Result = require("../models/result");
//Require the Company Model
const Company = require("../models/company");
//Require the Database Validation Middleware
const { DBValidation } = require("../config/middleware");
//Require the Path Finder Middleware
const { pathFinder } = require("../config/middleware");
//Require Mongoose Library
const mongoose = require("mongoose");

//Adds a new Student to the Database
module.exports.add = async (req, res) => {
	let DSA;
	let REACT;
	let WEB;

	//If there are no courses in the DB then create them
	try {
		let course = await Course.find({});
		if (course.length === 0) {
			DSA = await Course.create({ name: "data structures & algorithms" });
			WEB = await Course.create({ name: "web development" });
			REACT = await Course.create({ name: "react" });
		}
	} catch (error) {
		console.log(error);
	}

	try {
		let {
			name,
			age,
			gender,
			college,
			batch,
			dsa_score,
			react_score,
			web_score,
		} = req.body;

		//Create a new Student
		let student = await Student.create({
			name,
			age: Number(age),
			gender,
			college,
			avatar:
				gender === "male"
					? pathFinder("images/male-avatar.png")
					: pathFinder("images/female-avatar.png"),
			interviews: [],
			scores: [],
			results: [],
		});

		//Find the batch, if it doesn't exist, then create it
		let BATCH = await Batch.findOne({ name: batch });
		if (!BATCH) BATCH = await Batch.create({ name: batch });
		//Add the student to the batch
		BATCH.students.push(student);
		await BATCH.save();

		let obj = {};

		if (!!(DSA && WEB && REACT)) {
			let COURSES = [DSA, WEB, REACT];
			for (let COURSE of COURSES) {
				let SCORE = 0;
				if (COURSE.name === "data structures & algorithms") {
					SCORE = Number(dsa_score);
					obj.dsa = SCORE;
				} else if (COURSE.name === "web development") {
					SCORE = Number(web_score);
					obj.webd = SCORE;
				} else if (COURSE.name === "react") {
					SCORE = Number(react_score);
					obj.react = SCORE;
				}
				//Create student's score for the course
				let score = await Score.create({
					score: SCORE,
					student: student._id,
					course: COURSE._id,
				});
				//Add the score to the course
				COURSE.scores.push(score);
				await COURSE.save();
				//Add the score to the student
				student.scores.push(score);
				await student.save();
				//Find the enrolment for the batch and course, if it doesn't exist, then create it
				let enrolment = await Enrolment.findOne({
					batch: BATCH._id,
					course: COURSE._id,
				});
				if (!enrolment) {
					//Create the enrolment for the batch and course
					enrolment = await Enrolment.create({
						batch: BATCH._id,
						course: COURSE._id,
					});
					//Add the enrolment to the batch
					BATCH.enrolments.push(enrolment);
					await BATCH.save();
					//Add the enrolment to the course
					COURSE.enrolments.push(enrolment);
					await COURSE.save();
					//Update the enrolment with the batch and course
					enrolment.batch.students = BATCH.students;
					enrolment.course.scores = COURSE.scores;
					await enrolment.save();
				} else {
					//Update the enrolment with the batch and course
					enrolment.batch.students = BATCH.students;
					enrolment.course.scores = COURSE.scores;
					await enrolment.save();
					//Update the Batch with the enrolment
					await Batch.findOneAndUpdate(
						{ "enrolments._id": enrolment._id },
						{
							$set: {
								"enrolments.$.batch": enrolment.batch,
								"enrolments.$.course": enrolment.course,
							},
						}
					);
					//Update the Course with the enrolment
					await Course.findOneAndUpdate(
						{ "enrolments._id": enrolment._id },
						{
							$set: {
								"enrolments.$.batch": enrolment.batch,
								"enrolments.$.course": enrolment.course,
							},
						}
					);
				}
			}
		} else {
			let courses = await Course.find({});
			for (let course of courses) {
				let SCORE = 0;
				//Create student's score for the courses
				if (course.name === "data structures & algorithms") {
					SCORE = Number(dsa_score);
					obj.dsa = SCORE;
				} else if (course.name === "web development") {
					SCORE = Number(web_score);
					obj.webd = SCORE;
				} else if (course.name === "react") {
					SCORE = Number(react_score);
					obj.react = SCORE;
				}
				//Create student's score
				let score = await Score.create({
					score: SCORE,
					student: student._id,
					course: course._id,
				});
				//Add the score to the course
				course.scores.push(score);
				await course.save();
				//Add the score to the student
				student.scores.push(score);
				await student.save();
				//Find the enrolment for the batch and course, if it doesn't exist, then create it
				let enrolment = await Enrolment.findOne({
					batch: BATCH._id,
					course: course._id,
				});
				if (!enrolment) {
					//Create the enrolment for the batch and course
					enrolment = await Enrolment.create({
						batch: BATCH._id,
						course: course._id,
					});
					//Add the enrolment to the batch
					BATCH.enrolments.push(enrolment);
					await BATCH.save();
					//Add the enrolment to the course
					course.enrolments.push(enrolment);
					await course.save();
					//Update the enrolment with the batch and course
					enrolment.batch.students = BATCH.students;
					enrolment.course.scores = course.scores;
					await enrolment.save();
				} else {
					//Update the enrolment with the batch and course
					enrolment.batch.students = BATCH.students;
					enrolment.course.scores = course.scores;
					await enrolment.save();
					//Update the Batch with the enrolment
					await Batch.findOneAndUpdate(
						{ "enrolments._id": enrolment._id },
						{
							$set: {
								"enrolments.$.batch": enrolment.batch,
								"enrolments.$.course": enrolment.course,
							},
						}
					);
					//Update the Course with the enrolment
					await Course.findOneAndUpdate(
						{ "enrolments._id": enrolment._id },
						{
							$set: {
								"enrolments.$.batch": enrolment.batch,
								"enrolments.$.course": enrolment.course,
							},
						}
					);
				}
			}
		}

		//Add the batch to the student's batch
		student.batch = BATCH;
		await student.save();

		//Find the interview for the student
		let interviews = await Interview.find({ student: student._id });
		if (interviews.length !== 0) {
			for (let interview of interviews) {
				//Add the interview to the student's interviews
				student.interviews.push(interview);
				await student.save();
			}
		}

		//Find the result for the student
		let results = await Result.find({ student: student._id });
		if (results.length !== 0) {
			for (let result of results) {
				//Add the result to the student's results
				student.results.push(result);
				await student.save();
			}
		}

		//Create the student response object
		obj.id = student._id.toString();
		obj.name = student.name;
		obj.age = student.age;
		obj.gender = student.gender;
		obj.college = student.college;
		obj.batch = student.batch.name;
		obj.status = student.status;
		obj.avatar = student.avatar;

		//Send the response
		return res.status(200).json({
			status: "success",
			message: "Student Created Successfully 🎊 🥳",
			student: obj,
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

//Deletes the student from the database
module.exports.delete = async (req, res) => {
	try {
		const CHECK = mongoose.Types.ObjectId.isValid(req.params.id);
		if (!CHECK) {
			return res.status(200).json({
				status: "error",
				message:
					"Something Went Wrong with your Browser. Please Refresh the Page 🤷‍♂️",
			});
		}

		//Find the student
		let student = await Student.findById(req.params.id);
		if (!student) {
			return res.status(404).json({
				status: "error",
				message: "Student Not Found 🤷‍♂️",
				error: "Not Found",
			});
		}

		//Updating the Batch's Students List
		let batch = await Batch.findById(student.batch._id);
		if (batch) {
			batch.students.pull(student);
			await batch.save();
		}

		//Updating Course's Scores & Deleting the Score
		let scores = await Score.find({ student: student._id });
		for (let score of scores) {
			let course = await Course.findById(score.course._id);
			//Updating Course's Scores
			if (course) {
				course.scores.pull(score);
				await course.save();
			}
			//Delete Score
			await score.remove();
			//Updating Enrolments List for the above updated Batch and Course
			let enrolment = await Enrolment.findOne({
				batch: batch._id,
				course: course._id,
			});
			//If enrolment exists
			if (enrolment) {
				//Update the enrolment with the batch students and course scores
				enrolment.batch.students = batch.students;
				enrolment.course.scores = course.scores;
				await enrolment.save();
				//Updating the Batch with the enrolment's batch & course
				await Batch.findOneAndUpdate(
					{ "enrolments._id": enrolment._id },
					{
						$set: {
							"enrolments.$.batch": enrolment.batch,
							"enrolments.$.course": enrolment.course,
						},
					}
				);
				//Updating the Course with the enrolment's batch & course
				await Course.findOneAndUpdate(
					{ "enrolments._id": enrolment._id },
					{
						$set: {
							"enrolments.$.batch": enrolment.batch,
							"enrolments.$.course": enrolment.course,
						},
					}
				);
			}
		}

		//Delete Batch if it has no Students
		if (batch.students.length === 0) {
			let enrolments = await Enrolment.find({ batch: batch._id });
			for (let enrolment of enrolments) {
				//Updating the Course by deleting the enrolment
				let course = await Course.findById(enrolment.course._id);
				course.enrolments.pull(enrolment);
				await course.save();
				//Delete Enrolment
				await enrolment.remove();
			}
			//Delete Batch
			await batch.remove();
		}

		//Delete the Interviews
		let interviews = await Interview.find({ student: student._id });
		//Updating those Companies which have the above Interviews List
		await Company.updateMany(
			{ interviews: { $in: interviews } },
			{ $pull: { interviews: { $in: interviews } } }
		);
		let results = await Result.find({ student: student._id });
		//Updating those Companies which have the above Results List
		await Company.updateMany(
			{ results: { $in: results } },
			{ $pull: { results: { $in: results } } }
		);

		let interviewIds = [];
		//Delete the Results
		for (let result of results) {
			await result.remove();
		}
		//Delete the Interviews
		for (let interview of interviews) {
			interviewIds.push(interview.id);
			await interview.remove();
		}

		//Deleting the Student
		let studentID = student.id;
		await student.remove();

		//If there are no students in the database
		let students = await Student.find({});
		if (students.length === 0) {
			students = [];
			//Delete the results and interviews collections
			await Interview.deleteMany({});
			await Result.deleteMany({});
			await Company.updateMany(
				{},
				{ $set: { interviews: [], results: [] } }
			);
		}
		let companies = await Company.find({}).populate("interviews");
		if (companies.length === 0) companies = [];

		//Send the response
		return res.status(200).json({
			status: "success",
			message: "Student Deleted Successfully 🎊 🥳",
			students: students,
			companies: companies,
			interviewIDs: interviewIds,
			studentID: studentID,
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

// Student Deletion Algorithm //
//1. Update Students List in Batch
//2. Update Scores List in Course
//3. Delete Scores having Student ID
//4. Update Enrolments List for the updated Batch and Course
//5. Update those Courses & Batches which have the above Enrolments List
//6. Delete Batch if it has no Students
//-	Updating those Courses which have the above Enrolments List
//-	Delete Enrolment
//7. Delete the Interviews
//8. Updating those Companies which have the above Results List
//9. Delete the Results
// Student Deletion Algorithm //
