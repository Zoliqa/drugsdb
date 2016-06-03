const mongoose = require("mongoose"),
	  Schema   = mongoose.Schema;

const FindingSchema = new Schema({
	candidateMatched: String,
	candidatePreferred: String,
	semType: String,
	drugs: [{
		name: String
	}]
});

const Finding = mongoose.model("Finding", FindingSchema);

module.exports = Finding;
