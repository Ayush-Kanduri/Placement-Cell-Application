//Displays the Job Portal Page
module.exports.portal = async function (req, res) {
	return res.render("job", {
		title: "Jobs Portal 💼",
	});
};
