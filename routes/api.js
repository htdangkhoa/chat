// Identify modules.
var modules = require("../modules/modules"),
    router = modules.router,
    User = require("../modules/models/user");

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
 * Params:	None
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

// Export router.
module.exports = router;