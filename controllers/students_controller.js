const Student = require("../models/student");
const Course = require("../models/course");
const Batch = require("../models/batch");
const Enrolment = require("../models/enrolment");
const Interview = require("../models/interview");
const Score = require("../models/score");
const Result = require("../models/result");
//Require the Database Validation Middleware
const { DBValidation } = require("../config/middleware");
//Require the Path Finder Middleware
const { pathFinder } = require("../config/middleware");

module.exports.add = async (req, res) => {
	let DSA;
	let REACT;
	let WEB;
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
			status,
			dsa_score,
			react_score,
			web_score,
		} = req.body;

		let student = await Student.create({
			name,
			age: Number(age),
			gender,
			college,
			status,
			avatar:
				gender === "male"
					? pathFinder("images/male-avatar.png")
					: pathFinder("images/female-avatar.png"),
		});

		let BATCH = await Batch.create({ name: batch });
		BATCH.students.push(student);
		await BATCH.save();

		if (DSA && WEB && REACT) {
			let score = await Score.create({
				score: Number(dsa_score),
				student: student._id,
				course: DSA._id,
			});
			DSA.scores.push(score);
			await DSA.save();
			student.scores.push(score);
			await student.save();
			let enrolment = await Enrolment.create({
				batch: Batch._id,
				course: DSA._id,
			});
			BATCH.enrolments.push(enrolment);
			await BATCH.save();
			DSA.enrolments.push(enrolment);
			await DSA.save();

			score = await Score.create({
				score: Number(web_score),
				student: student._id,
				course: WEB._id,
			});
			WEB.scores.push(score);
			await WEB.save();
			student.scores.push(score);
			await student.save();
			enrolment = await Enrolment.create({
				batch: BATCH._id,
				course: WEB._id,
			});
			BATCH.enrolments.push(enrolment);
			await BATCH.save();
			WEB.enrolments.push(enrolment);
			await WEB.save();

			score = await Score.create({
				score: Number(react_score),
				student: student._id,
				course: REACT._id,
			});
			REACT.scores.push(score);
			await REACT.save();
			student.scores.push(score);
			await student.save();
			enrolment = await Enrolment.create({
				batch: BATCH._id,
				course: REACT._id,
			});
			BATCH.enrolments.push(enrolment);
			await BATCH.save();
			REACT.enrolments.push(enrolment);
			await REACT.save();
		} else {
			let courses = await Course.find({});
			for (let course of courses) {
				let SCORE = 0;
				if (course.name === "data structures & algorithms") {
					SCORE = Number(dsa_score);
				} else if (course.name === "web development") {
					SCORE = Number(web_score);
				} else if (course.name === "react") {
					SCORE = Number(react_score);
				}
				let score = await Score.create({
					score: SCORE,
					student: student._id,
					course: course._id,
				});
				course.scores.push(score);
				await course.save();
				student.scores.push(score);
				await student.save();
				let enrolment = await Enrolment.create({
					batch: BATCH._id,
					course: course._id,
				});
				BATCH.enrolments.push(enrolment);
				await BATCH.save();
				course.enrolments.push(enrolment);
				await course.save();
			}
		}

		student.batch = BATCH;
		await student.save();

		let interview = await Interview.findOne({ student: student });
		if (interview) {
			student.interviews.push(interview);
			await student.save();
		}
		let result = await Result.findOne({ student: student._id });
		if (result) {
			student.results.push(result);
			await student.save();
		}

		let stud = {
			id: student.id,
			name,
			age,
			gender,
			college,
			batch,
			status,
			dsa: dsa_score,
			react: react_score,
			webd: web_score,
		};

		return res.status(200).json({
			status: "success",
			message: "Student Created Successfully 🎊 🥳",
			student: stud,
		});
	} catch (error) {
		console.log(error);
		const obj = DBValidation(req, res, error);
		req.flash("error", obj.message);
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
		//1. Update Students List in Batch
		//2. Update Scores List in Course
		//3. Delete Scores having Student ID
		//4. Update Enrolments List for the updated Batch and Course
		//5. Update those Courses & Batches which have the above Enrolments List

		let student = await Student.findById(req.params.id);
		if (!student) {
			return res.status(404).json({
				status: "error",
				message: "Student Not Found 🤷‍♂️",
				error: "Not Found",
			});
		}

		if (student === req.user) {
			//Updating the Batch's Students List
			let batch = await Batch.findById(student.batch);
			if (batch) {
				batch.students.pull(student);
				await batch.save();
			}

			let enrolments = [];

			//Deleting Student's Scores & Updating Courses Scores
			let scores = await Score.find({ student: student._id });
			for (let score of scores) {
				let course = await Course.findById(score.course);
				if (course) {
					course.scores.pull(score);
					await course.save();
				}
				await score.remove();
				let enrolment = await Enrolment.findOneAndUpdate(
					{
						batch: batch._id,
						course: course._id,
					},
					{
						$set: { batch: batch, course: course },
					}
				);
				enrolments.push(enrolment);
			}

			for (let enrolment of enrolments) {
				for (let item of batch.enrolments) {
					if (item._id.equals(enrolment._id)) {
						item = enrolment;
						await batch.save();
					}
				}
				for (let item of course.enrolments) {
					if (item._id.equals(enrolment._id)) {
						item = enrolment;
						await course.save();
					}
				}
			}

			await student.remove();
			return res.status(200).json({
				status: "success",
				message: "Student Deleted Successfully 🎊 🥳",
			});
		} else {
			return res.status(401).json({
				status: "error",
				message: "You are Not Authorized to Delete this Student 🤷‍♂️",
				error: "Unauthorized",
			});
		}
	} catch (error) {
		console.log(error);
		const obj = DBValidation(req, res, error);
		req.flash("error", obj.message);
		return res.status(500).json({
			status: "error",
			message: obj.message,
			response: error,
			error: "Internal Server Error",
		});
	}
};
