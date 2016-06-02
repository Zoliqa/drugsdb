const Drug = require('./drug.model');

function findAll() {
	return Drug.find({});
}

function update(drugId, additionalInfoId, keywords, interactionDrugs) {
	return Drug.findOneAndUpdate({
		_id: drugId,
		"additionalInfos._id": additionalInfoId
	}, {
		$set: {
			"additionalInfos.$.keywords": keywords,

		},
		$addToSet: {
			interactionDrugs: { $each: interactionDrugs }
		}
	});
}

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

function removeAll() {
	return Drug.remove({});
}

module.exports = {
	findAll: findAll,
	update: update,
	search: search,
	removeAll: removeAll
};
