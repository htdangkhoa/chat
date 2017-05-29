// Identify modules.
var config = require("../config"),
    express = require("express"),
    morgan = require("morgan"),
    helmet = require("helmet"),
    compression = require("compression"),
    mongoose = require("mongoose"),
    passport = require("./passport/passport").passport,
    cookieParser = require("cookie-parser"),
    session = require('client-sessions'),
    path = require("path"),
    fs = require("fs"),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    view = require("consolidate"),
    subdomain = require("express-subdomain"),
    socket = require("socket.io"),
    app = express(),
    expressMonitor = require("express-status-monitor"),
    server = require("http").Server(app),
    io = socket(server);

mongoose.connect(config.url);

// Export modules.
module.exports.express = express;
module.exports.expressMonitor = expressMonitor;
module.exports.router = express.Router();
module.exports.io = io;
module.exports.PORT = process.env.PORT || 8080;
module.exports.server = server;

// Use middleware.
var auth = require('http-auth');
var basic = auth.basic({
		realm: "Monitor Area",
    skipUser: true
	}, (username, password, callback) => { 
	    // Custom authentication
	    // Use callback(error) if you want to throw async error.
		callback(username === "root" && password === "1");
	}
);
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// app.use("/admin/status", auth.connect(basic))
app.use(expressMonitor({
  title: "Admin",
  path: "/admin/status",
  websocket: io,
  socketIoPort: 8080,
  iFrame: true
}));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  cookieName: 'session',
  secret: 'dAnGkho4*7896#',
  duration:1000 * 60 * 60 * 24 * 365 * 999,
  // activeDuration: 5 * 60 * 1000,
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.deserializeUser());
app.use(function(req, res, next) {
  res.render = function render(filename, params) {
    var file = path.resolve(path.join(__dirname, "../public/www"), filename);

    view.mustache(file, params || {}, function(error, html) {
      if (error) return next(error);

      res.setHeader("Content-Type", "text/html");
      res.end(html);
    });
  };

  next();
});

app.use("/", require("../routes/auth"));
app.use("/v1", require("../routes/socket"));
app.use("/v1", require("../routes/api"));
app.use("/dev", require("../routes/dev"));
app.use(subdomain("test", require("../routes/sub")))
app.use(express.static(path.join(__dirname, "../public/www")));

app.use(function(req, res) {
  res.status(404).render("404.html");
});