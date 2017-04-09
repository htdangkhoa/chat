// Identify modules.
var config = require("../config"),
    express = require("express"),
    compression = require("compression"),
    mongoose = require("mongoose"),
    passport = require("./passport/passport").passport,
    cookieParser = require("cookie-parser"),
    expressSession = require("express-session"),
    path = require("path");
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
module.exports.server = server;

// Use middleware.
app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.render = function render(filename, params) {
    var file = path.resolve(path.join(__dirname, "../public/www"), filename);

    view.mustache(file, params || {}, function(error, html) {
      if (error) return next(error);

      res.setHeader("Content-Type", "text/html");
      res.end(html);
    })
  };

  next();
})
app.use("/", require("../routes/route"));
app.use(express.static(path.join(__dirname, "../public/www")));
