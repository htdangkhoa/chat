var modules = require("../modules/modules"),
    router = modules.router;

router.get("/sub", function(req, res) {
    res.send("ok sub");
})

module.exports = router;