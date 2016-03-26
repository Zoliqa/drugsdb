"use strict";

const mongoose = require("mongoose"),
      q        = require("q"),
      dbUrl    = "mongodb://localhost:27017/drugsdb";

mongoose.Promise = q.Promise;

mongoose.connect(dbUrl);

global.dbUrl = dbUrl;

const logger = require("../logger/logger");

mongoose.connection.on('error', err => logger.error(err));
mongoose.connection.once('open', () => logger.info("connected to db"));
