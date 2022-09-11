//Require the Validation Result Module from the Express validator
const { validationResult } = require("express-validator");
//Require the Database Validation Middleware
const { DBValidation } = require("../config/middleware");
//Require the Path Finder Middleware
const { pathFinder } = require("../config/middleware");
//Require the Employee Model
const Employee = require("../models/employee");
//Require File System Module for the Directory
const fs = require("fs");
//Require Path Module for the Directory
const path = require("path");
//Require the BCryptJS Module
const bcrypt = require("bcryptjs");

//Displays the Home Page or the Login Page
module.exports.homepage = (req, res) => {
	if (req.isAuthenticated()) {
		return res.render("home", {
			title: "Home 🏠",
		});
	}
	return res.render("home", {
		title: "Login 👋",
	});
};

//Displays the Sign Up Page
module.exports.signup = (req, res) => {
	if (req.isAuthenticated()) {
		return res.render("home", {
			title: "Home 🏠",
		});
	}
	return res.render("signup", {
		title: "Sign Up 📝",
	});
};

//Creates a New User
module.exports.createUser = async (req, res) => {
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
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(req.body.password, salt);
				employee.password = hashedPassword;
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
module.exports.createSession = async (req, res) => {
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
