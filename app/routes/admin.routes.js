"use strict";

const express						   = require("express"),
	  child_process     			   = require('child_process'),
	  passportUtilities                = require("../passport/passport.utilities"),
	  router			               = express.Router(),
	  process_files_jsPath             = process.cwd() + "/data.import/process.files.js",
  	  //drugsInputDir                  = process.cwd() + "/../input/all/dm_spl_monthly_update_jan2016/homeopathic",
	  create_substances_collection_pig = process.cwd() + "/data.import/pig.queries/create_substances_collection.pig",
	  create_producers_collection_pig  = process.cwd() + "/data.import/pig.queries/create_producers_collection.pig",
  	  pigPath                          = "/home/zoliqa/Downloads/pig/pig-0.15.0/bin/pig";

var drugsInputDir = "/home/zoliqa/Documents/drugsdb/input/selected/";

router.post("/import", passportUtilities.isAdminUser, function (req, res, next) {
	let child = child_process.fork(process_files_jsPath, [drugsInputDir]);

	child.on("message", function (message) {
		res.json({ success: message.success });

		if (message.success) {
			let child2 = child_process.spawn(pigPath, ["-x", "local", create_substances_collection_pig]);
			child2.stdout.pipe(process.stdout);
			child2.stderr.pipe(process.stdout);

			let child3 = child_process.spawn(pigPath, ["-x", "local", create_producers_collection_pig]);
			child3.stdout.pipe(process.stdout);
			child3.stderr.pipe(process.stdout);
		}
	});
});

module.exports = router;
