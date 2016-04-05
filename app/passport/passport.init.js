const userQueries = require("../db/user.queries");

function init(passport) {
	passport.serializeUser(function (user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function (id, done) {
		userQueries.findById(id, function (err, user) {
			if (err)
				return done(null);

			return done(null, user);
		});
	});
}

module.exports = init;
