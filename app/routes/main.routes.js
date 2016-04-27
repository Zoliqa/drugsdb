const express			= require("express"),
	  drugQueries		= require("../db/drug.queries"),
	  producerQueries   = require("../db/producer.queries"),
	  substanceQueries	= require("../db/substance.queries"),
	  passportUtilities = require("../passport/passport.utilities"),
	  router			= express.Router(),
	  request 			= require("request"),
	  medlinePlusWsUrl  = "https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term=";

router.post("/searchall", passportUtilities.isAuthenticated, function (req, res, next) {
	drugQueries.search(req.body.term, (err, drugs) => {
		if (err)
			return next(err);

		return res.json(drugs);
	});
});

router.post("/searchdrug", passportUtilities.isAuthenticated, function (req, res, next) {
	drugQueries.search(req.body.term, (err, drugs) => {
		if (err)
			return next(err);

		return res.json(drugs);
	});
});

router.post("/searchproducer", passportUtilities.isAuthenticated, function (req, res, next) {
	producerQueries.search(req.body.term, (err, producers) => {
		if (err)
			return next(err);

		return res.json(producers);
	});
});

router.post("/searchsubstance", passportUtilities.isAuthenticated, function (req, res, next) {
	substanceQueries.search(req.body.term, (err, substances) => {
		if (err)
			return next(err);

		return res.json(substances);
	});
});

router.get("/searchmedterm", passportUtilities.isAuthenticated, function (req, res, next) {
	request(medlinePlusWsUrl + req.query.term, function (error, response, body) {
		if (error)
			next(error);

		if (response.statusCode === 200) {
			res.set("Content-Type", "text/xml");

			return res.send(body);
		}
	});
});

module.exports = router;
