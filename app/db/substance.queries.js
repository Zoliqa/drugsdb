const substanceModel = require("./substance.model");

function search(term, next) {
	substanceModel.Substance.find({
		name: {
			$regex: new RegExp(".*" + term + ".*", "i")
		}
	}, (err, substances) => {
		if (err)
			return next(err);

		return next(null, substances);
	});
}

function removeAll() {
	return substanceModel.Substance.remove({});
}

module.exports = {
	search: search,
	removeAll: removeAll
};
