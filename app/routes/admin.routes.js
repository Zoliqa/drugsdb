const express			= require("express"),
	  child_process     = require('child_process'),
	  passportUtilities = require("../passport/passport.utilities"),
	  processFiles 	    = require("../data.import/process.files"),
	  router			= express.Router();

router.post("/import", passportUtilities.isAdminUser, function (req, res, next) {
	console.log("import data started");

	var spawn = child_process.spawn;
	var pig = spawn("/home/zoliqa/Downloads/pig/pig-0.15.0/bin/pig", ["-x", "local", process.argv[2]]);

	pig.stdout.pipe(process.stdout);

	res.json({ success: true });
});

module.exports = router;
