// Identify modules.
var modules = require("../modules/modules"),
    router = modules.router,
	ObjectId = require("mongoose").Types.ObjectId,
    User = require("../modules/models/user"),
	Message = require("../modules/models/message");

/**
 * Name:	GET INFO
 * Method:	GET
 * Params:	id
 */
router.get("/info", function(req, res) {
	var id = req.param("id");

	User.findOne({
		_id: id
	}, ["email", "username", "directs", "channels"])
	.then(function(user) {
		return res.status(200).send({
			message: user
		});
	})
	.catch(function(error) {
		return res.status(200).send({
	      message: "Something went wrong. Please try again later."
	    });
	})
});

/**
 * Name:	GET ALL USER
 * Method:	GET
 * Params:	NONE
 */
router.get("/get_user", function(req, res) {
	User.find({}, ["email", "username"])
	.then(function(user) {
		res.status(200).send({
			message: user
		});
	})
	.then(function(error) {
		res.send(error);
	})
});

/**
 * Name:	CREATE DIRECT MESSAGE
 * Method:	POST
 * Params:	myEmail, otherEmail
 */
router.post("/direct/create", function(req, res) {
	var myEmail = req.body.myEmail,
		otherEmail = req.body.otherEmail;

	  ///////////////////////////////////////////////////
	 // Display error function.                       //
	///////////////////////////////////////////////////
	function displayError() {
		return res.status(400).send("Cannot create direct messages.");
	}

	User.find({
		email: {
			$in: [myEmail, otherEmail]
		}
	}, ["email", "username", "directs"])
	.then(function(users) {
		(users.length > 1) ? createRoom() : displayError();
		// (users.length > 1) ? addRoomToDirectArray() : displayError();

		//   ///////////////////////////////////////////////////
		//  // Create room function.                         //
		// ///////////////////////////////////////////////////
		function createRoom() {
			users.forEach(function(u) {
				var check = false;
				if (u.email === myEmail) {
					var _directs = u.directs;
					u.directs = [];
					_directs.forEach(function(d) {
						if (d.arrEmail.indexOf(myEmail) !== -1 && d.arrEmail.indexOf(otherEmail) !== -1) {
							check = true;
							if(!d.visible){
								console.log("enable visible");
								d.visible = true;
							}
						}
					});
					console.log("TEST", _directs);
					u.directs = _directs;
					u.save();					
					if(!check) {
						addRoomToDirectArray();
					}else {
						res.status(200).send({
							message: users
						})
					}
				}
				// u.save();
			})
			// addRoomToDirectArray();
		}
		// res.status(200).send({
		// 	message: users
		// })

		function addRoomToDirectArray() {
			var  message = new Message();
			message
			.save()
			.then(function(msg) {
				var directID = msg._id;
				users.forEach(function(user) {
					user.directs.push({
						_id: directID,
						arrEmail: [myEmail, otherEmail],
						visible: true
					})
					user.save();
				})
				return res.status(201).send({
					message: users
				});
			})
			.catch(function(error) {
				displayError();
			});
		}
	})
	.catch(function(error) {
		displayError();
	});
});

/**
 * Name:	REMOVE DIRECT MESSAGE
 * Method:	POST
 * Params:	myEmail, directID
 */
router.post("/direct/remove", function(req, res) {
	var myEmail = req.body.myEmail,
		directID = req.body.directID;

	User.findOne({
		email: myEmail
	}, ["email", "username", "directs"])
	.then(function(user) {
		if (user === null) return res.status(404).send({
			message: "Email not found."
		});
		
		var directs = user.directs;
		user.directs = [];
		for (var i = 0; i < directs.length; i++) {
			if (directs[i]._id == directID) {
				directs[i].visible = false;
				user.directs = directs;
				user.save();
				break;
			}
		}

		return res.status(200).send({
			message: user
		});
	})
	.catch(function(error) {
		return res.status(200).send({
			message: "Something went wrong. Please try again later."
		});
	});
});

// Export router.
module.exports = router;
