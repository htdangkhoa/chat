// Identify modules.
var modules = require("../modules/modules"),
    router = modules.router,
    passport = require("../modules/passport/passport").passport,
    base64 = require("base-64"),
    uuid = require("uuid"),
    User = require("../modules/models/user");

// Route part.
router.get("/", function(req, res) {
  var id, signed_in = false;

  if (req.user) {

  	User.findOne({
  		_id: req.user._id
  	}, function(err, user) {
      console.log("user.password | req.user.password: ", user.password + " | " + req.user.password);

  		if (user != null) {
  			if (req.user.password !== user.password) {
          req.logout();
          delete req.session;
          signed_in = false;
  			}else {
          signed_in = true;
        }
  			id = base64.encode(req.user._id);
  		}

      res.render("index.html", {
        "signed_in": signed_in,
        "id": id,
        "user": req.user
      });
  	})

    return;
  }

  res.render("index.html");
})

router.get("/authentication/signin", function(req, res) {
  res.redirect("/");
})

router.post("/authentication/register", function(req, res){
	var user = new User({
		// _id: uuid.v4(),
		email: req.body.email,
		password: req.body.password
	});

	user.save(function(err, result){
		if (err){
			console.log(err)
			if (err.code == 11000) {
				res.send("Email already exist.");
			}

			res.send(err.errmsg);
		}else {
			console.log(result);
			res.redirect("/#!/sign_in");
		}
	});
	// res.send("Test")
})

// router.post("/authentication/signin", passport.authenticate("local"), function(req, res) {
//     res.redirect("/");
// });

router.post("/authentication/signin", function(req, res, next) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (user !== null) {
      req.login(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/');
      });
    }
  })


    
});

router.post("/authentication/recovery", function(req, res) {

  User.findOne({
  	email: req.body.email
  }, function(err, user) {
    user.remove();

    var newUser = new User({
      _id: uuid.v4(),
      email: req.body.email,
      password: "2"
    })

    newUser.save();
  })

	// req.session.destroy(function (err) {
	//     res.redirect('/'); //Inside a callback… bulletproof!
	//   });
	res.redirect('/');
});

router.get("/fail", function(req, res) {
  res.send("Fail.");
})

// Export router.
module.exports = router;
