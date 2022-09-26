//Require the Validation Result Module from the Express validator
const { validationResult } = require("express-validator");
//Require the Database Validation Middleware
const { DBValidation } = require("../config/middleware");
//Require the Path Finder Middleware
const { pathFinder } = require("../config/middleware");
//Require the Employee Model
const Employee = require("../models/employee");
//Require the Student Model
const Student = require("../models/student");
//Require the Interview Model
const Interview = require("../models/interview");
//Require the Result Model
const Result = require("../models/result");
//Require the Company Model
const Company = require("../models/company");
//Require File System Module for the Directory
const fs = require("fs");
//Require Path Module for the Directory
const path = require("path");
//Require the BCryptJS Module
const bcrypt = require("bcryptjs");
//Require Mongoose Library
const mongoose = require("mongoose");

//Displays the Home Page or the Login Page
module.exports.homepage = async (req, res) => {
	//If the User is Logged In
	if (req.isAuthenticated()) {
		try {
			let query1 = [
				{
					path: "company",
				},
				{
					path: "result",
				},
				{
					path: "student",
				},
			];
			let query2 = [
				{
					path: "student",
				},
				{
					path: "course",
				},
			];
			let query3 = [
				{
					path: "student",
				},
				{
					path: "interview",
				},
				{
					path: "company",
				},
			];
			//Find all the Students
			let students = await Student.find({})
				.populate("batch")
				.populate({
					path: "interviews",
					populate: query1,
				})
				.populate({
					path: "scores",
					populate: query2,
				})
				.populate({
					path: "results",
					populate: query3,
				});
			//Find all the Companies
			let companies = await Company.find({})
				.populate({
					path: "results",
					populate: query3,
				})
				.populate({
					path: "interviews",
					populate: query1,
				});
			return res.render("home", {
				title: "Home 🏠",
				students: students,
				companies: companies,
			});
		} catch (err) {
			console.log(err);
			req.flash("error", err);
			return res.redirect("back");
		}
	}
	//If there are no Employees in the Database then delete all the uploaded files
	try {
		let employee = await Employee.find({});
		if (employee.length === 0) {
			//Read the Directory
			const files = await fs.promises.readdir(
				path.join(__dirname, "..", Employee.filePath)
			);
			//Delete all the Files
			for (let file of files) {
				fs.unlinkSync(path.join(__dirname, "..", Employee.filePath, file));
			}
		}
	} catch (error) {
		console.log(error);
	}
	return res.render("home", {
		title: "Login 👋",
	});
};

//Displays the Sign Up Page
module.exports.signup = (req, res) => {
	if (req.isAuthenticated()) return res.redirect("/");

	return res.render("signup", {
		title: "Sign Up 📝",
	});
};

//Creates a New User
module.exports.createUser = async (req, res) => {
	if (req.isAuthenticated()) return res.redirect("/");

	//BACKEND VALIDATION :: Validation Result from the Router
	const errors = validationResult(req);

	//If there are Errors in the Validation of the Form
	if (!errors.isEmpty()) {
		const error = errors.array();
		req.flash("error", error[0].msg);
		return res.redirect("back");
	}

	//Custom BACKEND VALIDATION :: Form
	if (req.body.password !== req.body.confirm_password) {
		req.flash("error", "Password didn't Match ❌");
		return res.redirect("back");
	}

	//Check if the User already exists
	try {
		let employee = await Employee.findOne({ email: req.body.email });
		if (!employee) {
			//New User Creation
			employee = await Employee.create(req.body);
			try {
				//Hashes the Password
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(req.body.password, salt);
				employee.password = hashedPassword;
				//Saves the Employee Avatar Path with Blank Avatar
				employee.avatarPath = pathFinder("images/empty-avatar.png");
				await employee.save();
				req.flash("success", "User Created Successfully 🎊 🥳");
				return res.redirect("/");
			} catch (err) {
				console.log(err);
				req.flash("error", err);
				return res.redirect("back");
			}
		} else {
			req.flash("error", "User Already Exists 😲");
			return res.redirect("back");
		}
	} catch (error) {
		console.log(error);
		const obj = DBValidation(req, res, error);
		req.flash("error", obj.message);
		return res.redirect("back");
	}
};

//Creates a New Session or Logs the User In
module.exports.createSession = (req, res) => {
	if (req.isAuthenticated()) return res.redirect("/");
	req.flash("success", "Logged In Successfully 🔥");
	return res.redirect("/");
};

//Destroys the Session or Logs the User Out
module.exports.destroySession = (req, res) => {
	req.logout((err) => {
		if (err) return next(err);
		req.flash("success", "Logged Out Successfully 🚀");
		return res.redirect("/");
	});
};

//Displays the Profile Page
module.exports.profile = async (req, res) => {
	try {
		const CHECK = mongoose.Types.ObjectId.isValid(req.params.id);
		if (!CHECK) {
			return res.status(200).json({
				status: "error",
				message:
					"Something Went Wrong with your Browser. Please Refresh the Page 🤷‍♂️",
			});
		}

		//Find the Employee to show the Profile
		const employee = await Employee.findById(req.params.id);
		return res.render("profile", {
			title: "Profile 👨",
			profile_user: employee,
		});
	} catch (error) {
		console.log(error);
		const obj = DBValidation(req, res, error);
		req.flash("error", obj.message);
		return res.redirect("back");
	}
};

//Updates the Profile Page
module.exports.update = async (req, res) => {
	try {
		const CHECK = mongoose.Types.ObjectId.isValid(req.params.id);
		if (!CHECK) {
			return res.status(200).json({
				status: "error",
				message:
					"Something Went Wrong with your Browser. Please Refresh the Page 🤷‍♂️",
			});
		}

		//If the Logged In User is the same as the Employee's Profile then Update the Profile
		if (req.params.id == req.user.id) {
			//Find the User by the ID
			let employee = await Employee.findById(req.params.id);
			//Call Employee's static method to upload the Profile Picture
			Employee.uploadedFile(req, res, async (err) => {
				if (err) {
					console.log("Error in MULTER: ", err);
					return res.redirect("back");
				}

				//Set Name & Email
				employee.name = req.body.name;
				employee.email = req.body.email;
				//Hash the Password
				if (req.body.password !== employee.password) {
					const salt = await bcrypt.genSalt(10);
					const hashedPassword = await bcrypt.hash(
						req.body.password,
						salt
					);
					employee.password = hashedPassword;
				}

				//If Incoming File Exists
				if (req.file) {
					//If Employee Avatar already exists in the Database
					if (employee.avatarPath) {
						//If Employee Avatar already exists in the "/uploads/employees/avatars" Directory
						if (
							fs.existsSync(
								path.join(__dirname, "..", employee.avatarPath)
							)
						) {
							//Delete that Old Avatar
							fs.unlinkSync(
								path.join(__dirname, "..", employee.avatarPath)
							);
						}
					}
					//Save the New Avatar
					//Saving the path of the uploaded file into the avatarPath field of the employee
					employee.avatarPath =
						Employee.filePath + "/" + req.file.filename;
				}
				//Save the Employee
				await employee.save();

				req.flash("success", "Profile Updated Successfully 🎊 🥳");
				return res.redirect("back");
			});
		} else {
			req.flash("error", "Unauthorized ❌");
			return res.status(401).send("Unauthorized");
		}
	} catch (error) {
		console.log(error);
		const obj = DBValidation(req, res, error);
		req.flash("error", obj.message);
		return res.redirect("back");
	}
};
