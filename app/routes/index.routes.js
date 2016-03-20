
var express = require('express'),
	router  = express.Router(),
	path	= require("path");

function init(app, passport) {
	router.get("/", function (req, res) {
		res.render("index", { title: "DrugsDB" });
	});

	//
	// router.get("/favicon.ico", function (req, res) {
	// 	res.sendFile(path.resolve(__dirname + "/../public/images/favicon.ico"), function (err) {
	// 		if (err)
	// 			res.status(err.status).end();
	// 	});
	// });

	app.use("/", router);

	var userRoutes = require("./user.routes");
	app.use("/user", userRoutes);

	var adminRoutes = require("./admin.routes");
	app.use("/admin", adminRoutes);

	var mainRoutes = require("./main.routes");
	app.use("/main", mainRoutes);
}

module.exports = init;
