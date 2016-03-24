const mongoose = require("mongoose"),
	  Schema   = mongoose.Schema,
	  substance = require("./substance.model.js");

const DrugSchema = new Schema({
	name: String,
	producer_id: String,
	producer_name: String,
	ingredients: [substance.SubstanceSchema]
})

const Drug = mongoose.model("Drug", DrugSchema);

module.exports = Drug;
