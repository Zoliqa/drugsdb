const mongoose  	  = require("mongoose"),
	  Schema    	  = mongoose.Schema,
	  substance 	  = require("./substance.model"),
	  additionalInfo  = require("./additional.info.model");

const DrugSchema = new Schema({
	name: String,
	producerId: String,
	producerName: String,
	ingredients: [substance.SubstanceSchema],
	additionalInfos: [additionalInfo.AdditionalInfoSchema]
})

const Drug = mongoose.model("Drug", DrugSchema);

module.exports = Drug;
