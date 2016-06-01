const Finding = require('./finding.model');

function save(name, semTypes) {
	return Finding.findOneAndUpdate({
		name: name,
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
