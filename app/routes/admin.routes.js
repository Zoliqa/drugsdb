"use strict";

const express			= require("express"),
	  child_process     = require('child_process'),
	  passportUtilities = require("../passport/passport.utilities"),
	  router			= express.Router();

router.post("/import", passportUtilities.isAdminUser, function (req, res, next) {
	let processFilesPath = process.cwd() + "/data.import/process.files.js";
	let inputDir = process.cwd() + "/../input/all/dm_spl_monthly_update_jan2016/homeopathic"; // "/../input/selected";

	let child = child_process.fork(processFilesPath, [inputDir]);

	child.on("message", function (message) {
		res.json({ success: message.success });
	});

	// processFiles("/home/zoliqa/Documents/drugsdb/input/selected");

	// var spawn = child_process.spawn;
	// var pig = spawn("/home/zoliqa/Downloads/pig/pig-0.15.0/bin/pig", ["-x", "local", process.argv[2]]);
	//
	// pig.stdout.pipe(process.stdout);
});

module.exports = router;
