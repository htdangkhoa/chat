// Identify modules.
var modules = require("../modules/modules"),
    router = modules.router,
    User = require("../modules/models/user");

router.get("/info", function(req, res) {
	var id = req.param("id");

	User.findOne({
		id: id
	}, function(err, user) {
		if (err || user === null) return res.send({
	      code: 200,
	      message: "Something went wrong. Please try again later."
	    });

		if (user !== null) {
			return res.send({
				code: 200,
				message: {
					id: user.id,
					email: user.email
				}
			});
		}
	});
});

// Export router.
module.exports = router;