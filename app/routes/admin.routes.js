"use strict";

const express						   = require("express"),
	  child_process     			   = require('child_process'),
	  passportUtilities                = require("../passport/passport.utilities"),
	  logger 						   = require("../logger/logger"),
	  q 							   = require("q"),
	  router			               = express.Router(),
	  process_files_jsPath             = process.cwd() + "/data.import/process.files.js",
	  create_substances_collection_pig = process.cwd() + "/data.import/pig.queries/create_substances_collection.pig",
	  create_producers_collection_pig  = process.cwd() + "/data.import/pig.queries/create_producers_collection.pig",
	  create_findings_collection_pig  = process.cwd() + "/data.import/pig.queries/create_findings_collection.pig",
  	  pigPath                          = "/home/zoliqa/Downloads/pig/pig-0.15.0/bin/pig",
	  // drugsInputDir                    = process.cwd() + "/../input/selected_interactions";
	  //drugsInputDir                    = process.cwd() + "/../input/all/dm_spl_monthly_update_jan2016/homeopathic";
	  drugsInputDir                    = process.cwd() + "/../input/all/dm_spl_monthly_update_jan2016";

function logPigQueryResult(message, log) {
	if (/success!/i.exec(log))
		logger.info(message, log);

	if (/error/i.exec(log))
		logger.error(message, log);
}

function init(io) {
	router.post("/import", passportUtilities.isAdminUser, function (req, res, next) {
		res.json({ started: true });

		let deferred = q.defer();

		io.on("connection", function(socket) {
			deferred.resolve(socket);

			socket.on("forceDisconnect", () => {
				socket.disconnect();

				console.log("user disconnected");
			});
		});

		let child = child_process.fork(process_files_jsPath, [drugsInputDir]);

		child.on("message", function (message) {
			deferred.promise.then(socket => socket.emit("progress", 1/4));

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
				child2.on("close", code => {
			  		deferred.promise.then(socket => socket.emit("progress", 1/4));
				});

				let child3 = child_process.spawn(pigPath, ["-x", "local", create_producers_collection_pig]);
				child3.stderr.on("data", data => {
					var log = data.toString();

					logPigQueryResult("create_producers_collection.pig", log);
				});
				child3.on("error", () => logger.error("failed to start child process for create_producers_collection.pig"));
				child3.on("close", code => {
					deferred.promise.then(socket => socket.emit("progress", 1/4));
				});

				let child4 = child_process.spawn(pigPath, ["-x", "local", create_findings_collection_pig]);
				child4.stderr.on("data", data => {
					var log = data.toString();

					logPigQueryResult("create_findings_collection.pig", log);
				});
				child4.on("error", () => logger.error("failed to start child process for create_findings_collection.pig"));
				child4.on("close", code => {
					deferred.promise.then(socket => socket.emit("progress", 1/4));
				});
			}
		});
	});

	return router;
}

module.exports = init;
