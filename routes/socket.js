// Identify modules.
var modules = require("../modules/modules"),
    router = modules.router,
    io = modules.io,
	workerFarm = require("worker-farm"),
	worker = workerFarm(require.resolve("./worker")),
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

	// Handle room.
	var arrChat = [];
	socket.on("listen", function(room) {
		console.log(room);

		if (room.oldRoom) {
			socket.leave(room.oldRoom);
		}

		socket.join(room.newRoom);
		arrChat = [];
	})

	socket.on("messages", function(message) {
		console.log(message);
		arrChat.push(message);
		
		socket.broadcast.to(message.room).emit("messages", {
			email: message.email.substring(0, message.email.indexOf("@")),
			content: message.text
		})
	})
});


// for (let i = 0; i < num; i++) {
// 		worker(i, function (err, outp) {
// 			setTimeout(function() {
// 				console.log(outp);
// 			}, 2000)
// 			if (i == num - 1)
// 				workerFarm.end(worker)
// 		})
// 	}
router.post("/test", function(req, res) {
	var data = req.body.data;

	worker(data, function (err, outp) {
		console.log(outp);
		workerFarm.end(worker);
		res.status(200).send(outp);
	})

	// res.status(200).send("OK");
})

// Export router.
module.exports = router;