const mongoose    = require("mongoose"),
	  searchEntry = require("./search.entry.model"),
	  Schema      = mongoose.Schema;

var User = mongoose.model("User", {
	id: String,
	username: String,
	password: String,
	firstname: String,
	lastname: String,
	email: String,
	birthdate: Date,
	isAdmin: Boolean,
	searches: [searchEntry.SearchEntrySchema]
});

module.exports = User;
