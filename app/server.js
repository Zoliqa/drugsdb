var express = require("express"),
	passport = require("passport");
	bodyParser = require("body-parser"),
	session = require("express-session"),
	cookieParser = require("cookie-parser"),
	mongoose = require("mongoose"),
	passportInit = require("./passport/passport.init"),
	indexRoutes = require("./routes/index.routes"),
	dbUrl = "mongodb://localhost:27017/drugsdb",
	app = express();

mongoose.connect(dbUrl);

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(session({
	secret: "secret",
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(passport.initialize());
app.use(cookieParser());
app.use(passport.session());

passportInit(passport);

app.use("/public", express.static(__dirname + "/public"));

indexRoutes(app, passport);

if (!module.parent) {
	app.listen(4000);
}

module.exports = app;
