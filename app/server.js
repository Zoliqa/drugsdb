const express      = require("express"),
	  passport     = require("passport"),
	  bodyParser   = require("body-parser"),
	  session      = require("express-session"),
	  cookieParser = require("cookie-parser"),
	  passportInit = require("./passport/passport.init"),
	  indexRoutes  = require("./routes/index.routes"),
	  connection   = require("./db/connection"),
	  logger       = require("./logger/logger")
	  app          = express(),
	  server	   = require("http").createServer(app),
	  io		   = require("socket.io")(server);

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(session({
	secret: "secret",
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(passport.session());

passportInit(passport);

app.use("/public", express.static(__dirname + "/public"));

indexRoutes(app, passport, io);

if (!module.parent)
	server.listen(4000);

module.exports = app;
