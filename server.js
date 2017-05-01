// Identify modules.
var modules = require("./modules/modules"),
    PORT = modules.PORT,
    server = modules.server;

// Start server on port 8080.
server.listen(PORT, "127.0.0.1", function() {
  console.log("Server is running on port " + PORT);
});
