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
	}, function(err, user) {
		if (err || user === null) return res.status(200).send({
	      message: "Something went wrong. Please try again later."
	    });

		if (user !== null) {
			return res.status(200).send({
				message: {
					id: user.id,
					email: user.email
				}
			});
		}
	});
});

router.get("/get_user", function(req, res) {
	User.find({})
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