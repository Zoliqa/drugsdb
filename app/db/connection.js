const mongoose = require("mongoose"),
      q        = require("q"),
      dbUrl    = "mongodb://localhost:27017/drugsdb";

mongoose.Promise = q.Promise;

mongoose.connect(dbUrl);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
	console.log("connected to db");
});
