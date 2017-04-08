// Identify modules.
var identify = require("./identify/identify"),
    server = identify.server;

// Start server on port 8080.
server.listen(8080, "0.0.0.0", function() {
  console.log("Connected.");
});
