// Identify modules.
var modules = require("../modules/modules"),
    router = modules.router,
    User = require("../modules/models/user");

router.get("/info", function(req, res) {
	res.send("ok");
});

// Export router.
module.exports = router;