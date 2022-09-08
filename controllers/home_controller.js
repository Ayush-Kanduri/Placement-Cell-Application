//Displays the Home Page or the Login Page
module.exports.homepage = (req, res) => {
	return res.render("home", {
		title: "Home | Login",
	});
};

//Displays the Sign Up Page
module.exports.signup = (req, res) => {
	return res.render("signup", {
		title: "Sign Up",
	});
};
