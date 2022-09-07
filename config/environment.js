//Require the Dotenv Library
const dotenv = require("dotenv").config();

//Development Environment
const development = {
	name: "development",
	asset_path: process.env.DEVELOPMENT_ASSET_PATH,
	session_cookie_key: process.env.DEVELOPMENT_SESSION_COOKIE_KEY,
	db: process.env.DEVELOPMENT_DB,
	db_name: process.env.DB_NAME,
	deployment: process.env.DEPLOYMENT,
	website_link: process.env.DEVELOPMENT_WEBSITE_LINK,
	google_client_id: process.env.GOOGLE_CLIENT_ID,
	google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
	google_callback_url: process.env.DEVELOPMENT_GOOGLE_CALLBACK_URL,
	morgan: {
		mode: "dev",
		options: {
			stream: accessLogStream,
		},
	},
};

//Production Environment
const production = {
	name: "production",
	asset_path: process.env.ASSET_PATH,
	session_cookie_key: process.env.SESSION_COOKIE_KEY,
	db: process.env.DB,
	db_name: process.env.DB_NAME,
	deployment: process.env.DEPLOYMENT,
	website_link: process.env.WEBSITE_LINK,
	google_client_id: process.env.GOOGLE_CLIENT_ID,
	google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
	google_callback_url: process.env.GOOGLE_CALLBACK_URL,
	morgan: {
		mode: "dev",
		options: {
			stream: accessLogStream,
		},
	},
};

//Export the Environment
module.exports =
	eval(process.env.ENVIRONMENT) == undefined
		? development
		: eval(process.env.ENVIRONMENT);
