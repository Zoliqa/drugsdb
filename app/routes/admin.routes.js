"use strict";

const express						= require("express"),
	  child_process     			= require('child_process'),
	  passportUtilities             = require("../passport/passport.utilities"),
	  router			            = express.Router(),
	  process_files_jsPath          = process.cwd() + "/data.import/process.files.js",
  	  drugsInputDir                 = process.cwd() + "/../input/all/dm_spl_monthly_update_jan2016/homeopathic",
	  join_substances_drugs_pigPath = process.cwd() + "/data.import/pig.queries/join_substances_drugs.pig",
  	  pigPath                       = "/home/zoliqa/Downloads/pig/pig-0.15.0/bin/pig";

router.post("/import", passportUtilities.isAdminUser, function (req, res, next) {
	let child = child_process.fork(process_files_jsPath, [drugsInputDir]);

	child.on("message", function (message) {
		res.json({ success: message.success });

		if (message.success) {
			let child2 = child_process.spawn(pigPath, ["-x", "local", join_substances_drugs_pigPath]);
			child2.stdout.pipe(process.stdout);
		}
	});
});

module.exports = router;
