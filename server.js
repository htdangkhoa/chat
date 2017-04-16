// Identify modules.
var modules = require("./modules/modules"),
    server = modules.server;

// Start server on port 8080.
server.listen(8080, "127.0.0.1", function() {
  console.log("Connected.");
});
