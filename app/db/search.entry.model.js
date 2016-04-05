const mongoose = require("mongoose"),
	  Schema   = mongoose.Schema;

var SearchEntrySchema = new Schema({
	id: String,
	type: String,
	term: String,
	date: Date
});

var SearchEntry = mongoose.model("SearchEntry", SearchEntrySchema);

module.exports = {
	SearchEntrySchema: SearchEntrySchema,
	SearchEntry: SearchEntry
};
