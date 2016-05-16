const User = require('./user.model');

function findByUsername(username, next) {
	User.findOne({
		username: username
	}, function (err, user) {
		if (err)
			return next(err);

		return next(null, user);
	});
}

function findById(id, next) {
	User.findOne({
		_id: id
	}, function (err, user) {
		if (err)
			return next(err);

		return next(null, user);
	});
}

function create(user, next) {
	var newUser = new User(user);

	newUser.save(function (err) {
		if (err)
			return next(err);

		next(null, newUser);
	});
}

function update(id, user, next) {
	User.findOneAndUpdate({ _id: id }, user, {
		new: true
	}, function (err, updatedUser) {
		if (err)
			return next(err);

		return next(null, updatedUser);
	});
}

function remove(id, next) {
	User.findOneAndRemove({ _id: id }, function (err, user) {
		if (err)
			return next(err);

		return next(null, user);
	});
}

module.exports = {
	findByUsername: findByUsername,
	findById: findById,
	create: create,
	update: update,
	remove: remove
};
