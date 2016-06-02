 const producerModel = require("./producer.model");

function search(term, next) {
	producerModel.Producer.find({
		producerName: {
			$regex: new RegExp(".*" + term + ".*", "i")
		}
	}, (err, producers) => {
		if (err)
			return next(err);

		return next(null, producers);
	});
}

function removeAll() {
	return producerModel.Producer.remove({});
}

module.exports = {
	search: search,
    removeAll: removeAll
};
