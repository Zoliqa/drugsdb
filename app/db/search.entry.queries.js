const searchEntry = require("./search.entry.model"),
	  User        = require("./user.model");

function findAll(userId, next) {
	User.findOne({
		_id: userId
	}, function (err, user) {
		if (err)
			return next(err);

		return next(null, user.searches);
	});
}

function create(userId, newSearchEntry, next) {
	var newSearchEntry = new searchEntry.SearchEntry(newSearchEntry);

	User.findOneAndUpdate({
		_id: userId
	}, {
		$push: {
			searches: {
				$each: [newSearchEntry],
				$position: 0
			},
		}
	}, err => {
		if (err)
			return next(err);

		return next(null, newSearchEntry);
	});
}

function remove(userId, searchEntryId, next) {
	User.findOneAndUpdate({
		_id: userId
	}, {
		$pull: {
			searches: {
				_id: searchEntryId
			}
		}
	}, err => {
		if (err)
			return next(err);

		return next(null);
	});
}

module.exports = {
	findAll: findAll,
	create: create,
	remove: remove
};
