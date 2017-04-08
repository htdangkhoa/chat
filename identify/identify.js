// Identify modules.
var express = require("express"),
    compression = require("compression"),
    path = require("path");
    bodyParser = require("body-parser"),
    cors = require("cors"),
    ejs = require("ejs"),
    socket = require("socket.io"),
    app = express(),
    server = require("http").Server(app),
    io = socket(server);

// Export modules.
module.exports.express = express;
module.exports.router = express.Router();
module.exports.server = server;

// Use route as middleware.
app.use("/", require("../routes/route"));
app.use(compression());
app.use(express.static(path.join(__dirname, "../public/www")));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "../public/www"));
// app.engine("html", ejs.renderFile);
