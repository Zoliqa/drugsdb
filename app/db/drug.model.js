const mongoose  	      = require("mongoose"),
	  Schema    	      = mongoose.Schema,
	  substanceModel 	  = require("./substance.model"),
	  additionalInfoModel = require("./additional.info.model");

const DrugSchema = new Schema({
	name: String,
	producerId: String,
	producerName: String,
	ingredients: [substanceModel.SubstanceSchema],
	additionalInfos: [additionalInfoModel.AdditionalInfoSchema],
	interactionDrugs: [String]
})

const Drug = mongoose.model("Drug", DrugSchema);

module.exports = Drug;
