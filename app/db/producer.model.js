const mongoose = require("mongoose"),
	  Schema   = mongoose.Schema;

const ProducerSchema = new Schema({
	producer_id: String,
	producer_name: String,
	drugs: [{
		name: String,
		ingredients: Array
	}]
}, {
	collection: "producers"
});

ProducerSchema.index({ producer_name: 1 });

const Producer = mongoose.model("Producer", ProducerSchema);

module.exports = {
	Producer: Producer,
	ProducerSchema: ProducerSchema
};
