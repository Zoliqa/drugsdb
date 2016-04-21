const mongoose      = require("mongoose"),
	  Schema        = mongoose.Schema,
	  keywordModel  = require("./keyword.model");

const AdditionalInfoSchema = new Schema({
	code: String,
	name: String,
	title: String,
	text: String,
	warningsXml: String,
	keywords: [keywordModel.KeywordSchema]
}, {
	collection: "additionalInfos"
});

const AdditionalInfo = mongoose.model("AdditionalInfo", AdditionalInfoSchema);

module.exports = {
	AdditionalInfo: AdditionalInfo,
	AdditionalInfoSchema: AdditionalInfoSchema
};
