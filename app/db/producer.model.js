const mongoose = require("mongoose"),
	  Schema   = mongoose.Schema;

const ProducerSchema = new Schema({
	producerId: String,
	producerName: String,
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
