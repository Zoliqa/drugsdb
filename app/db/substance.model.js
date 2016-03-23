const mongoose = require("mongoose"),
	  Schema   = mongoose.Schema;

const SubstanceSchema = new Schema({
	code: String,
	name: String
});

SubstanceSchema.index({ code: 1 });

const Substance = mongoose.model("Substance", SubstanceSchema);

module.exports = {
	Substance: Substance,
	SubstanceSchema: SubstanceSchema
};
