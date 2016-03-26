"use strict";

const winston  = require("winston");

require("winston-mongodb").MongoDB;

// winston.add(winston.transports.MongoDB, {
// 	db: global.connection//,/
// 	//collection: "logs"
// });

let logger = new (winston.Logger)({
    transports: [
  		new (winston.transports.Console)(),
      	new (winston.transports.MongoDB)({
	  		db: global.dbUrl,
			collection: "logs"
	  	})
    ]
  });

function info(message, data) {
	logger.info(message, data && { data: data } || null);
}

function error(message, error) {
	logger.log("error", message, { error: error });
}

module.exports = {
	info: info,
	error: error
}
