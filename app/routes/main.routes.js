var express				= require("express"),
	drugQueries			= require("../db/drug.queries"),
	passportUtilities	= require("../passport/passport.utilities"),
	router				= express.Router();

router.post("/search", passportUtilities.isAuthenticated, function (req, res, next) {
	drugQueries.search(req.body.term, (err, drugs) => {
		if (err)
			return next(err);

		return res.json(drugs);
	});
});

module.exports = router;
