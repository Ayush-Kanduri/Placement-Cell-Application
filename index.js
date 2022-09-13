//Require the Express Module for running the Express Server
const express = require("express");
//Create Express App for Request-Response Cycle & to create the Express Server
const app = express();
//Create Express Server Port
const port = process.env.PORT || 8000;
//Require the Path Module for the Directory
const path = require("path");
//Require the File System Module for the Directory
const fs = require("fs");
//Require the DotEnv Library
const dotenv = require("dotenv").config();
//Require the CORS Module for allowing Cross-Origin Requests
const cors = require("cors");
//Requires the Express-EJS-Layouts Module
const expressLayouts = require("express-ejs-layouts");
//Requires the EJS Module
const ejs = require("ejs");
//Requires the Node SASS Middleware Module
const sassMiddleware = require("node-sass-middleware");
//Require the Morgan Module for Logging
const logger = require("morgan");
//Requires the Cookie-Parser Module
const cookieParser = require("cookie-parser");
//Requires the Express-Session Module for the Session Cookie
const session = require("express-session");
//Requires the MongoStore
const MongoStore = require("connect-mongo");
//Requires the PassportJS Module for the Authentication
const passport = require("passport");
//Requires the Connect Flash Module
const flash = require("connect-flash");
//Require the View Helpers
const viewHelpers = require("./config/view-helpers")(app);
//Require the Environment File for getting the Environment Variables
const env = require("./config/environment");
//Requires MongoDB
const db = require("./config/mongoose");
//Requires the index.js - Route File, from the Routes Folder.
const route = require("./routes/index");
//Requires the Custom Middleware
const customMiddleware = require("./config/middleware");
//Requires the Passport Local Strategy used for the Authentication
const passportLocal = require("./config/passport-local-strategy");
//Requires the Passport Google OAuth-2 Strategy used for the Authentication
const passportGoogle = require("./config/passport-google-oauth2-strategy");

//Middleware - CORS
app.use(cors());
//Middleware - SASS Middleware
if (env.name == "development") {
	app.use(
		sassMiddleware({
			//Where to look for the SASS files
			src: path.join(__dirname, env.asset_path, "scss"),
			//Where to put the compiled CSS files
			dest: path.join(__dirname, env.asset_path, "css"),
			//Reports error.
			debug: false,
			//The code should be in a single line - "compressed" or multiple lines - "expanded"
			outputStyle: "extended",
			//Prefix for the CSS files - where to look out for the css files in the assets folder
			prefix: "/css",
		})
	);
}
//Middleware - URL Encoder
app.use(express.urlencoded({ extended: true }));
//Middleware - JSON Encoder
app.use(express.json());
//Middleware - Cookie Parser for accessing & parsing the cookies
app.use(cookieParser());
//Middleware - Express App uses Static Files in the Assets Folder
app.use(express.static(env.asset_path));
//Middleware - Make the '/storage' path available to the browser
app.use("/storage", express.static(__dirname + "/storage"));
//Middleware - Make the '/uploads' path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));
//Middleware - Express App uses expressLayouts to tell that the views which are going to be rendered belongs to some layout.
app.use(expressLayouts);
//Middleware - Morgan used for Logging
app.use(logger(env.morgan.mode, env.morgan.options));

//Set Up - Extract Styles from Sub Pages into the Layout.
app.set("layout extractStyles", true);
//Set Up - Extract Scripts from Sub Pages into the Layout.
app.set("layout extractScripts", true);
//Set Up - Template Engine as EJS
app.set("view engine", "ejs");
//Set Up - Template Engine Views Folder Path (..../views)
app.set("views", path.join(__dirname, "views"));

//Middleware - Creates a Session Cookie and Encrypts it with a Key
app.use(
	session({
		//Cookie Name
		name: "PlacementCellApplication",
		//Secret Key for encrypting the session cookie
		secret: env.session_cookie_key,
		//Don't save the uninitialized session
		saveUninitialized: false,
		//Don't re-save the session if it is not modified
		resave: false,
		//Cookie Options
		cookie: {
			//Cookie Expiry Time - 100 Minutes
			maxAge: 1000 * 60 * 100,
		},
		//MongoStore is used to store the Session Cookies in the MongoDB
		store: MongoStore.create(
			{
				//DB Connection URL
				mongoUrl: `${env.db}`,
				//Interacts with the mongoose to connect to the MongoDB
				mongooseConnection: db,
				//To auto remove the store
				autoRemove: "disabled",
			},
			(err) => {
				//If there is an error
				if (err) {
					console.log(err || "connect-mongodb setup ok");
				}
			}
		),
	})
);
//Middleware - Initializes & uses PassportJS for the Authentication
app.use(passport.initialize());
//Middleware - PassportJS creates & maintains the Session
app.use(passport.session());
//Middleware - Sets the Authenticated User in the Response
app.use(passport.setAuthenticatedUser);
//Middleware - Uses the Flash Message just after the Session Cookie is set
app.use(flash());
//Middleware - Uses the Custom Middleware to set the Flash Message in the Response
app.use(customMiddleware.setFlash);
//Middleware - Creates Folders if they don't exist
app.use(customMiddleware.createFolders);
//Middleware - App calls index.js - Route File, whenever '/' route is called in the request.
app.use("/", route);

//Run the ExpressJS Server
app.listen(port, (err) => {
	if (err) return console.log("Error: ", err);
	console.log(`Server is running successfully on port ${port}`);
});
