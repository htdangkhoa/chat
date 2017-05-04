// Identify modules.
var modules = require("../modules/modules"),
    router = modules.router,
    User = require("../modules/models/user"),
	Message = require("../modules/models/message");

/**
 * Name:	RESET DATA USER
 * Method:	GET
 * Params:	NONE
 */
router.get("/user/reset", function(req, res) {
	User.find({})
	.then(function(users) {
		users.forEach(function(user) {
			user.channels = [];
			user.directs = [];
			user.save();
		})
		return res.send(users);
	})
	.catch(function(error) {
		return res.send(error);
	})
});

/**
 * Name:	RESET SESSION
 * Method:	GET
 * Params:	NONE
 */
router.get("/session/reset", function(req, res) {
	// req.session.destroy();
	req.logout();
	res.send(req.session)
});

// Export router.
module.exports = router;