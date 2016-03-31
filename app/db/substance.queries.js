
var substance = require("./substance.model");

function search(term, next) {
	substance.Substance.find({
		name: {
			$regex: new RegExp(".*" + term + ".*", "i")
		}
	}, (err, substances) => {
		if (err)
			return next(err);

		return next(null, substances);
	});
}

module.exports = {
	search: search
};
