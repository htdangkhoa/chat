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
 * Params:	myID, otherID
 */
router.post("/direct/create", function(req, res) {
	var myID = req.body.myID,
		otherID = req.body.otherID;

	  ///////////////////////////////////////////////////
	 // Display error function.                       //
	///////////////////////////////////////////////////
	function displayError() {
		return res.status(404).send("Cannot create direct messages.");
	}

	User.find({
		_id: {
			$in: [myID, otherID]
		}
	}, ["email", "directs"])
	.then(function(users) {
		(users.length > 1) ? createRoom() : displayError();

		  ///////////////////////////////////////////////////
		 // Create room function.                         //
		///////////////////////////////////////////////////
		function createRoom() {
			var  message = new Message();
			message
			.save()
			.then(function(msg) {
				var directID = msg._id;
				users.forEach(function(user) {
					user.directs.push({
						_id: directID,
						arrEmail: [users[0].email, users[1].email]
					})
					user.save();
				})
				return res.status(200).send({
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

// Export router.
module.exports = router;