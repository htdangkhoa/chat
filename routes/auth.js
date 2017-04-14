// Identify modules.
var modules = require("../modules/modules"),
    router = modules.router,
    passport = require("../modules/passport/passport").passport,
    base64 = require("base-64"),
    uuid = require("uuid"),
    User = require("../modules/models/user"),
    nodemailer = require("nodemailer");

// Config nodemailer.
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: your_email,
    pass: your_password
  }
});

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

  // User.findOne({
  // 	email: req.body.email
  // }, function(err, user) {
  //   user.remove();

  //   var newUser = new User({
  //     _id: uuid.v4(),
  //     email: req.body.email,
  //     password: "2"
  //   })

  //   newUser.save();
  // })

  var email = req.body.email;

  User.findOne({
    email: email
  }, function(err, user) {
    if (user  !== null) {
      transporter.sendMail({
        from: "DevChat",
        to: email,
        subject: "",
        html: "<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1.0'><link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'><link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css' integrity='sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp' crossorigin='anonymous'><style type='text/css'>* > a {color: #00FE00 !important;}body > * {background-color: #222222 !important;}.logo {font-weight: bold;overflow: hidden;text-align: center;font-size: 7px;padding-left: 0px;border: none;}.container {border: 1px solid #CCCCCC;margin: 0px !important;padding: 0px;background-color: #222222 !important;}.container > * {color: #00FE00;background-color: #222222 !important;}#btn-reset {border: 1px solid #ccc !important;padding: 5px !important;text-decoration: none !important;}#btn-reset:hover {color: #CCCCCC !important;}</style></head><body><div class='container'><div style='padding: 0px 15px;'><h2>Reset password</h2><p>Hello, <span style='font-weight: bold;'>" 

          + email + 

          "</span>, Someone requested a password reset for your <span style='font-weight: bold;'>DevChat account.</span></p><a id='btn-reset' href='" 
          
          + "http://192.168.222.124:8080/#!/password/reset/" + user._id +

          "' target='_blank'>Reset Password</a><p style='margin-top: 10px;'>If you didn't request this link, you can simply ignore this email.</p><br/><p>Thank you.</p></div></body></html>"
      }, function(err, info) {
        if (err) return console.log(err);

        return console.log(info);
      });
    }
  });

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
