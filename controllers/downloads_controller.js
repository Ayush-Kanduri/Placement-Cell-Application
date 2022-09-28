//Require Student Model
const Student = require("../models/student");
//Require Company Model
const Company = require("../models/company");
//Require Interview Model
const Interview = require("../models/interview");
//Require Result Model
const Result = require("../models/result");
//Require File System Module for the Directory
const fs = require("fs");
//Require Path Module for the Directory
const path = require("path");
//Require the Database Validation Middleware
const { DBValidation } = require("../config/middleware");
//Require the Parser Module from the JSON2CSV Library
const { Parser } = require("json2csv");
//Require the Stringify Module from the CSV-Stringify Library
const { stringify } = require("csv-stringify");

//Downloads the CSV Report of all the Data of Students & Interviews
module.exports.downloadReport = async function (req, res) {
	try {
		//Find all the Students
		const students = await Student.find({})
			.populate("batch")
			.populate({
				path: "interviews",
				populate: [
					{
						path: "company",
					},
					{
						path: "result",
					},
					{
						path: "student",
					},
				],
			})
			.populate({
				path: "scores",
				populate: [
					{
						path: "student",
					},
					{
						path: "course",
					},
				],
			})
			.populate({
				path: "results",
				populate: [
					{
						path: "student",
					},
					{
						path: "interview",
					},
					{
						path: "company",
					},
				],
			});
		//Find all the Companies
		const companies = await Company.find({})
			.populate({
				path: "results",
				populate: [
					{
						path: "student",
					},
					{
						path: "interview",
					},
					{
						path: "company",
					},
				],
			})
			.populate({
				path: "interviews",
				populate: [
					{
						path: "company",
					},
					{
						path: "result",
					},
					{
						path: "student",
					},
				],
			});
		//Find all the Interviews
		const interviews = await Interview.find({})
			.populate("company")
			.populate("result")
			.populate("student");
		//Find all the Results
		const results = await Result.find({})
			.populate("student")
			.populate("interview")
			.populate("company");

		//If the Students are not found
		if (students.length === 0) {
			req.flash("error", "Please Add Some Students First 🤷‍♂️");
			return res.redirect("back");
		}
		//If the Companies are not found
		if (companies.length === 0) {
			req.flash("error", "Please Add Some Companies First 🤷‍♂️");
			return res.redirect("back");
		}
		//If the Interviews are not found
		if (interviews.length === 0) {
			req.flash("error", "Please Add Some Interview Slots First 🤷‍♂️");
			return res.redirect("back");
		}
		//If the Results are not found
		if (results.length === 0) {
			req.flash(
				"error",
				"Please Add Students & Results to the Interview Slots First 🤷‍♂️"
			);
			return res.redirect("back");
		}

		const Data = [];
		//Function :: Capitalizes the First Letter of each Word
		function Capitalize(sentence) {
			const words = sentence.split(" ");
			return words
				.map((word) => word[0].toUpperCase() + word.slice(1))
				.join(" ");
		}

		//Creates an array of objects for the Students Report
		for (let student of students) {
			for (let interview of student.interviews) {
				let OBJ = {};

				const react = student.scores.find(
					(score) => score.course.name === "react"
				);
				const web = student.scores.find(
					(score) => score.course.name === "web development"
				);
				const dsa = student.scores.find(
					(score) => score.course.name === "data structures & algorithms"
				);

				OBJ["Student ID"] = `${student._id.toString()}`;
				OBJ["Student Name"] = `${Capitalize(student.name)}`;
				OBJ["Student Age"] = `${student.age}`;
				OBJ["Student Gender"] = `${Capitalize(student.gender)}`;
				OBJ["Student Batch"] = `${student.batch.name}`;
				OBJ["Student College"] = `${Capitalize(student.college)}`;
				OBJ["Student Status"] = `${Capitalize(student.status)}`;
				OBJ["React Score"] = `${react.score}`;
				OBJ["Web Development Score"] = `${web.score}`;
				OBJ["Data Structures & Algorithms Score"] = `${dsa.score}`;
				OBJ["Interview Company"] = `${Capitalize(interview.company.name)}`;
				OBJ["Interview Date"] = `${new Date(
					interview.company.date
				).toLocaleDateString()}`;
				OBJ["Interview Result"] = `${Capitalize(interview.result.result)}`;

				Data.push(OBJ);
			}
		}

		//Parse the Data & convert it to CSV format
		const parser = new Parser();
		const csv = parser.parse(Data);
		// const csv = stringify(Data, { header: true });

		try {
			//Create a file with the CSV data
			await fs.promises.writeFile(
				path.join(__dirname, "..", "/uploads/reports", "Report.csv"),
				csv
			);
			//Download the file to the user
			res.download(
				path.join(__dirname, "..", "/uploads/reports", "Report.csv")
			);
			//Read all Files in the Uploads
			const files = await fs.promises.readdir(
				path.join(__dirname, "..", "/uploads/reports")
			);
			//Delete existing files from the location
			if (files && files.length > 0) {
				//Delete existing Files from the Uploads
				for (let file of files) {
					fs.unlinkSync(
						path.join(__dirname, "..", "/uploads/reports", file)
					);
				}
			}
		} catch (error) {
			console.log(error);
			return res.redirect("back");
		}
	} catch (error) {
		console.log(error);
		const obj = DBValidation(req, res, error);
		req.flash("error", obj.message);
		return res.redirect("back");
	}
};
