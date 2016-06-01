const Finding = require('./finding.model');

function save(name, next) {
	return Finding.findOneAndUpdate({
		name: name
	}, {
		$inc: {
			count: 1
		}
	}, {
		upsert: true
	});

	// (err, finding) => {
	// 	if (err)
	// 		return next(err);
	//
	// 	return next(null, finding);
	// });
}

module.exports = {
	save: save
};
