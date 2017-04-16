// Identify modules.
var modules = require("../modules/modules"),
    router = modules.router,
    io = modules.io,
    listID = [],
    listEmail = [],
    listMessage = [];

// Enable socket io.
io.on("connection", function(socket) {
	socket.on("Connected", function(email) {
		socket.email = email.substring(0, email.indexOf("@"));
		// if (listEmail.indexOf(socket.email) !== -1) {
		// 	listEmail.splice(listEmail.indexOf(socket.email), 1);
		// }
		listEmail.push(socket.email);
		console.log("CONNECTED LISTEMAIL: ", listEmail);
		io.sockets.emit("ListEmail", listEmail);
	});

	socket.on("disconnect", function() {
		listEmail.splice(listEmail.indexOf(socket.email), 1);
		console.log("DISCONNECTED LISTEMAIL: ", listEmail);
		io.sockets.emit("ListEmail", listEmail);
	});

	socket.on("chat", function(data) {
		data.email = data.email.substring(0, data.email.indexOf("@"))
		listMessage.push(data);
		console.log("CHAT LISTMESSAGE: ", listMessage)
		io.sockets.emit("chat", listMessage);
	});

	io.sockets.emit("chat", listMessage);
});

// Export router.
module.exports = router;