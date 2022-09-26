//Get list of all the jobs
const Jobs = require("../storage/json/jobs.json");
//Require Path Module
const path = require("path");
//Require File System Module
const fs = require("fs");

//Displays the Job Portal Page
module.exports.portal = async function (req, res) {
	try {
		const jobs = [];
		const dates = [5, 10, 15, 20, 25, 30];
		const file = path.join(__dirname, `../storage/json/jobs.json`);
		//Reads the JSON file
		let json = await fs.promises.readFile(file, "utf8");
		//Parses the JSON file
		let data = JSON.parse(json);
		let flag = 0;
		for (let key in data) {
			if (data[key].interview_date !== "") {
				flag = 1;
				break;
			}
			//Set the interview date
			const randomDate = dates[Math.floor(Math.random() * dates.length)];
			const newDate = new Date(
				new Date().getTime() + randomDate * 24 * 60 * 60 * 1000
			);
			data[key].interview_date = newDate.toLocaleDateString();
			//Create the Data
			jobs.push(data[key]);
		}
		if (flag === 0) {
			//Write the JSON file
			await fs.promises.writeFile(file, JSON.stringify(data, null, 2));
		} else {
			for (let key in data) jobs.push(data[key]);
		}

		return res.render("job", {
			title: "Jobs Portal 💼",
			jobs: JSON.stringify(jobs),
		});
	} catch (error) {
		console.log(error);
		return res.render("job", {
			title: "Jobs Portal 💼",
			jobs: [],
		});
	}
};
