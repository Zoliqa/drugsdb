"use strict";

const express						   = require("express"),
	  child_process     			   = require('child_process'),
	  passportUtilities                = require("../passport/passport.utilities"),
	  logger 						   = require("../logger/logger"),
	  router			               = express.Router(),
	  process_files_jsPath             = process.cwd() + "/data.import/process.files.js",
	  create_substances_collection_pig = process.cwd() + "/data.import/pig.queries/create_substances_collection.pig",
	  create_producers_collection_pig  = process.cwd() + "/data.import/pig.queries/create_producers_collection.pig",
  	  pigPath                          = "/home/zoliqa/Downloads/pig/pig-0.15.0/bin/pig",
	  drugsInputDir                    = process.cwd() + "/../input/all/dm_spl_monthly_update_jan2016/homeopathic";

function logPigQueryResult(message, log) {
	if (/success!/i.exec(log))
		logger.info(message, log);

	if (/error/i.exec(log))
		logger.error(message, log);
}

router.post("/import", passportUtilities.isAdminUser, function (req, res, next) {
	let processFiles = require("../data.import/process.files");

	let child = child_process.fork(process_files_jsPath, [drugsInputDir]);

	child.on("message", function (message) {
		res.json({ success: message.success });

		if (message.success)
			logger.info("import to drugs collection is done");
		else
			logger.error("import to drugs collection failed");

		if (message.success) {
			let child2 = child_process.spawn(pigPath, ["-x", "local", create_substances_collection_pig]);
			child2.stderr.on('data', data => {
				var log = data.toString();

				logPigQueryResult("create_substances_collection.pig", log);
			});
			child2.on("error", () => logger.error("failed to start child process for create_substances_collection.pig"));

			let child3 = child_process.spawn(pigPath, ["-x", "local", create_producers_collection_pig]);
			child3.stderr.on('data', data => {
				var log = data.toString();

				logPigQueryResult("create_producers_collection.pig", log);
			});
			child3.on("error", () => logger.error("failed to start child process for create_producers_collection.pig"));
		}
	});
});

module.exports = router;
