const Finding = require('./finding.model');

function save(matchedName, preferredName, semTypes) {
	return Finding.findOneAndUpdate({
		matchedName: matchedName,
		preferredName: preferredName,
		semTypes: semTypes
	}, {
		$inc: {
			count: 1
		}
	}, {
		upsert: true
	});
}

function removeAll() {
	return Finding.remove({});
}

module.exports = {
	save: save,
	removeAll: removeAll
};
