// Identify modules.
var modules = require("../modules/modules"),
    router = modules.router,
    io = modules.io,
    listID = [],
    listMessage = [];

// Enable socket io.
io.on("connection", function(socket) {
	console.log(socket.id);

	listID.push(socket.id);

	io.sockets.emit("get list", listID);

	socket.on("disconnect", function() {
		console.log("ID disconnected", socket.id);
		listID.splice(listID.indexOf(socket.id), 1);
		io.sockets.emit("get list", listID);
	});

	socket.emit("get id", socket.id);

	socket.on("chat", function(data) {
		listMessage.push(data);

		io.sockets.emit("chat", listMessage);
	});

	io.sockets.emit("chat", listMessage);
});

// Export router.
module.exports = router;