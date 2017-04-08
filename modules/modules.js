// Identify modules.
var express = require("express"),
    compression = require("compression"),
    path = require("path");
    bodyParser = require("body-parser"),
    cors = require("cors"),
    view = require("consolidate"),
    socket = require("socket.io"),
    app = express(),
    server = require("http").Server(app),
    io = socket(server);

// Export modules.
module.exports.express = express;
module.exports.router = express.Router();
module.exports.server = server;

// Use route as middleware.
// app.set("view engine", "ejs");
// app.set("www", path.join(__dirname, "../public/www"));
// app.engine("html", ejs.renderFile);

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
app.use(compression());
app.use(express.static(path.join(__dirname, "../public/www")));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
