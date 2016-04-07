const express			 = require("express"),
	  searchEntryQueries = require("../db/search.entry.queries"),
	  passportUtilities  = require("../passport/passport.utilities"),
	  router			 = express.Router();

router.post("/", passportUtilities.isAuthenticated, function (req, res, next) {
	searchEntryQueries.create(req.user._id, req.body, (err, searchEntry) => {
		if (err)
			return next(err);

		return res.json(searchEntry);
	});
});

router.get("/", passportUtilities.isAuthenticated, function (req, res, next) {
	searchEntryQueries.findAll(req.user._id, (err, searchEntries) => {
		if (err)
			return next(err);

		return res.json(searchEntries);
	});
});

router.delete("/:id", passportUtilities.isAuthenticated, function (req, res, next) {
	searchEntryQueries.remove(req.user._id, req.params.id, err => {
		if (err)
			return next(err);

		return res.json(null);
	});
});

module.exports = router;
