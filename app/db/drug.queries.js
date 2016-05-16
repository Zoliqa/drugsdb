const Drug = require('./drug.model');

function search(term, next) {
	Drug.find({
		name: {
			$regex: new RegExp(".*" + term + ".*", "i")
		}
	}, (err, drugs) => {
		if (err)
			return next(err);

		return next(null, drugs);
	});
}

module.exports = {
	search: search
};
