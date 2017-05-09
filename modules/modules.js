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
    socket = require("socket.io"),
    app = express(),
    server = require("http").Server(app),
    io = socket(server);


mongoose.connect(config.url);

// Export modules.
module.exports.express = express;
module.exports.router = express.Router();
module.exports.io = io;
module.exports.PORT = process.env.PORT || 8080;
module.exports.server = server;

// Use middleware.
app.use(morgan("dev"));
app.use(helmet({
  frameguard: false
}));
app.use(compression());
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
app.use(express.static(path.join(__dirname, "../public/www")));
