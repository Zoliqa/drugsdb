const mongoose = require("mongoose"),
	  Schema   = mongoose.Schema;

const SubstanceDrugsSchema = new Schema({
	substance_code: String,
	drugnames: String
}, {
	collection: "substance_drugs"
});

const SubstanceDrugs = mongoose.model("SubstanceDrugs", SubstanceDrugsSchema);

module.exports = SubstanceDrugs;
