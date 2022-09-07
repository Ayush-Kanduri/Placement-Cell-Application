const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, (err) => {
	if (err) return console.log("Error: ", err);
	console.log(`Server is running successfully on port ${port}`);
});
