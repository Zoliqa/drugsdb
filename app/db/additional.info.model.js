const mongoose = require("mongoose"),
	  Schema   = mongoose.Schema;

const AdditionalInfoSchema = new Schema({
	code: String,
	name: String,
	title: String,
	text: String
}, {
	collection: "additionalInfos"
});

const AdditionalInfo = mongoose.model("AdditionalInfo", AdditionalInfoSchema);

module.exports = {
	AdditionalInfo: AdditionalInfo,
	AdditionalInfoSchema: AdditionalInfoSchema
};
