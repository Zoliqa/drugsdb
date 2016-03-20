
var mongoose = require("mongoose"),
	Schema	 = mongoose.Schema;

var User = mongoose.model("User", {
	id: String,
	username: String,
	password: String,
	firstname: String,
	lastname: String,
	email: String,
	birthdate: Date,
	isAdmin: Boolean  
});

module.exports = User;
