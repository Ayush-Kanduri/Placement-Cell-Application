//Require the Passport Library
const passport = require("passport");
//Require the Passport Local Strategy
const LocalStrategy = require("passport-local").Strategy;
//Require the Employee Model
const Employee = require("../models/employee");
//Require the Bcrypt Library
const bcrypt = require("bcryptjs");

//--Authentication using PassportJS--//
//PassportJS will use the Local Strategy function() to find the Employee who has signed in
passport.use(
	new LocalStrategy(
		{
			usernameField: "email", //The one in the DB
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				const employee = await Employee.findOne({ email: email });
				if (!employee) {
					req.flash("error", "Invalid Username/Password ❌");
					return done(null, false);
				}
				//Check the Hashed Password in the DB with the Password entered
				const isMatch = await bcrypt.compare(password, employee.password);
				if (!isMatch) {
					req.flash("error", "Invalid Username/Password ❌");
					return done(null, false);
				}
				return done(null, employee);
			} catch (err) {
				console.log("Error in finding the Employee --> Passport ❌");
				req.flash("error", err);
				return done(err);
			}
		}
	)
);

//--Serializing the Employee to decide which key is to be kept in the cookies--//
passport.serializeUser((employee, done) => {
	//It automatically encrypts the Employee ID into the cookie, & sends it to the browser
	done(null, employee.id);
});

//--Deserializing the User from the key in the cookies--//
passport.deserializeUser((id, done) => {
	//It automatically decrypts the Employee ID from the cookie, & finds the Employee
	Employee.findById(id, (err, employee) => {
		if (err) {
			console.log("Error in finding the Employee --> Passport ❌");
			return done(err);
		}
		return done(null, employee);
	});
});

//Creating a middleware in passport.js
passport.checkAuthentication = function (req, res, next) {
	//If the Employee is signed in then let them have the profile page
	if (req.isAuthenticated()) return next();
	//If the Employee is not signed in, then redirect them back to the Login page
	return res.redirect("/");
};

//Creating a middleware in passport.js
passport.setAuthenticatedUser = function (req, res, next) {
	//Whenever a Employee is signed in, then that Employee's info is available in req.user
	if (req.isAuthenticated()) res.locals.user = req.user;
	//req.user contains the current signed in user from the session cookie
	next();
};

//Export the Passport Module
module.exports = passport;
