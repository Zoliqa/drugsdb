var express				= require("express"),
	bcrypt				= require('bcrypt-nodejs'),
	userQueries			= require("../db/user.queries"),
	passportUtilities	= require("../passport/passport.utilities"),
	router				= express.Router();

router.post("/login", function (req, res, next) {
	userQueries.findByUsername(req.body.username, function (err, user) {
		if (err)
			return next(err);

		if (!user)
			return res.json(null);

		bcrypt.compare(req.body.password, user.password, function (err, result) {
			if (err)
				return next(err);

			if (!result)
				return res.json(null);

			req.logIn(user, function (err) {
				if (err)
					return next(err);

				return res.json(user);
			});
		});
	});
});

router.get("/logout", passportUtilities.isAuthenticated, function (req, res) {
	req.logout();
	res.json({});
});

router.get("/:username", function (req, res, next) {
	userQueries.findByUsername(req.params.username, function (err, user) {
		if (err)
			return next(err);

		if (!user)
			return res.json(null);

		return res.json(user);
	});
});

router.get("/", function (req, res, next) {
	if (req.isAuthenticated())
		return res.json(req.user);

	return res.json(null);
});

router.post("/", function (req, res, next) {
	userQueries.create(req.body, function (err, user) {
		if (err)
			return next(err);

		res.json(user);
	});
});

router.put("/", passportUtilities.isAuthenticated, function (req, res, next) {
	userQueries.update(req.user._id, req.body, function (err, user) {
		if (err)
			return next(err);

		res.json(user);
	});
});

router.delete("/", passportUtilities.isAuthenticated, function (req, res, next) {
	userQueries.remove(req.user._id, function (err, user) {
		if (err)
			return next(err);

		return res.json({ user: user });
	});
});

module.exports = router;
