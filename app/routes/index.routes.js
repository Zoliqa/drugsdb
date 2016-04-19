var express = require('express'),
	router  = express.Router();

function init(app, passport, io) {
	router.get("/", function (req, res) {
		res.render("index", { title: "DrugsDB", NODE_ENV: process.env.NODE_ENV });
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

	var adminRoutes = require("./admin.routes")(io);
	app.use("/admin", adminRoutes);

	var mainRoutes = require("./main.routes");
	app.use("/main", mainRoutes);

	var searchEntryRoutes = require("./search.entry.routes");
	app.use("/searchentry", searchEntryRoutes);
}

module.exports = init;
