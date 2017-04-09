// Identify modules.
var modules = require("../modules/modules"),
    router = modules.router,
    passport = require("../modules/passport/passport").passport;
    User = require("../modules/models/user");

// Route part.
router.get("/", function(req, res) {
  var id, signed_in = false;

  if (req.user) {
    id = req.user._id;
    signed_in = true;
  }

  res.render("index.html", {
    "signed_in": signed_in,
    "id": id
  });
})

router.get("/login", function(req, res) {
  res.redirect("/");
})

router.post("/signup", function(req, res){
	var user = new User({
		email: req.body.email,
		password: req.body.password
	});

	user.save(function(err, result){
		if (err){
			if (err.code == 11000) {
				res.send("Email already exist.");
			}

			res.send(err.errmsg);
		}else {
			console.log(result);
			res.redirect("/")
		}
	});
})

router.post("/login", passport.authenticate("local", { failureRedirect: '/fail' }), function(req, res) {
    res.redirect("/");
});

router.get("/fail", function(req, res) {
  res.send("Fail.");
})

// Export router.
module.exports = router;
