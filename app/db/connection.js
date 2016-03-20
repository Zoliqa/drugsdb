const mongoose = require("mongoose"),
      dbUrl    = "mongodb://localhost:27017/drugsdb";

mongoose.connect(dbUrl);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
	console.log("connected to db");
});
