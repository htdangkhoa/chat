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
	}, ["_id", "email", "directs", "channels"])
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
	User.find({}, ["_id", "email"])
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
		return res.status(404).send("Cannot create direct messages.");
	}

	User.find({
		email: {
			$in: [myEmail, otherEmail]
		}
	}, ["email", "directs"])
	.then(function(users) {
		(users.length > 1) ? createRoom() : displayError();

		  ///////////////////////////////////////////////////
		 // Create room function.                         //
		///////////////////////////////////////////////////
		function createRoom() {
			var check = false;

			/**Start check already created room. */
			for (var i = 0; i < users.length; i++) {
				switch (users[i].email) {
					case myEmail: {
						var directs = users[i].directs;

						/**Reset directs array to empty. */
						users[i].directs = [];

						for (var j = 0; j < directs.length; j++) {
							if (directs[j].arrEmail.indexOf(otherEmail) !== -1 && !directs[j].visible) {
								check = true;
								directs[j].visible = true;

								/**Resave directs array. */
								users[i].directs = directs;
								users[i].save();
								console.log(users[i].directs[j])
								break;
							}
						}
					}
				}
			}
			/**End check. */

			if (!check) {
				// Start create room.
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
			}else {
				return res.status(201).send({
					message: users
				});
			}
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
	}, ["email", "directs"])
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
})

// Export router.
module.exports = router;