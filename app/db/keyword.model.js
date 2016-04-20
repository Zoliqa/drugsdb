const mongoose = require("mongoose"),
	  Schema   = mongoose.Schema;

const KeywordSchema = new Schema({
	candidateMatched: String,
	candidatePreferred: String,
	semTypes: [String]
});

const Keyword = mongoose.model("Keyword", KeywordSchema);

module.exports = {
	Keyword: Keyword,
	KeywordSchema: KeywordSchema
};
