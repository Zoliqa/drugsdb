const mongoose = require("mongoose"),
	  Schema   = mongoose.Schema;

const FindingSchema = new Schema({
	name: String,
	semTypes: [String],
	count: Number
});

const Finding = mongoose.model("Finding", FindingSchema);

module.exports = Finding;
