const mongoose = require("mongoose"),
	  Schema   = mongoose.Schema;

const DrugSchema = new Schema({
	name: String,
	producer: String,
	ingredients: String
})

const Drug = mongoose.model("Drug", DrugSchema);

module.exports = Drug;
