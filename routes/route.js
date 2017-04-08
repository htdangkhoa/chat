// Identify modules.
var modules = require("../modules/modules"),
    router = modules.router;

// Route part.
router.get("/", function(req, res) {
  res.render("index.html", {
    "test": "hello"
  });
})

router.get("/login", function(req, res) {
  res.redirect("/");
})

// Export router.
module.exports = router;
