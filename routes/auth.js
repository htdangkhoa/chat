// Identify modules.
var modules = require("../modules/modules"),
    router = modules.router,
    passport = require("../modules/passport/passport").passport,
    uuid = require("uuid"),
    User = require("../modules/models/user"),
    nodemailer = require("nodemailer"),
    expressSession = require("express-session");

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
    signed_in = true;
    id = req.user.id;
  }

  res.render("index.html", {
    "signed_in": signed_in,
    "id": id
  });
});

router.get("/authentication/signin", function(req, res) {
  res.redirect("/");
});

router.post("/authentication/register", function(req, res){
	var user = new User({
		email: req.body.email,
		password: req.body.password
	});

	user.save(function(err, result){
		if (err){
			console.log(err)
			if (err.code == 11000) {
				return res.send({
          code: 302,
          message: "Email already exist."
        });
			}

			return res.send(err.errmsg);
		}else {
			console.log(result);
			res.redirect("/");
		}
	});
});

router.post("/authentication/signin", passport.authenticate("local", { failureRedirect:'/fail' }), function(req, res) {
    res.redirect("/");
});

router.post("/email/recovery", function(req, res) {
  var email = req.body.email;

  User.findOne({
    email: email
  }, function(err, user) {
    if (err || user === null) return res.send({
      code: 200,
      message: "Something went wrong. Please try again later."
    });

    if (user  !== null) {
      transporter.sendMail({
        from: your_email,
        to: email,
        subject: "",
        html: "<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1.0'><link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'><link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css' integrity='sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp' crossorigin='anonymous'><style type='text/css'>* > a {color: #00FE00 !important;}body > * {background-color: #222222 !important;}.logo {font-weight: bold;overflow: hidden;text-align: center;font-size: 7px;padding-left: 0px;border: none;}.container {border: 1px solid #CCCCCC;margin: 0px !important;padding: 0px;background-color: #222222 !important;}.container > * {color: #00FE00;background-color: #222222 !important;}#btn-reset {border: 1px solid #ccc !important;padding: 5px !important;text-decoration: none !important;}#btn-reset:hover {color: #CCCCCC !important;}</style></head><body><div class='container'><div style='padding: 0px 15px;'><h2>Reset password</h2><p>Hello, <span style='font-weight: bold;'>" 

          + email + 

          "</span>, Someone requested a password reset for your <span style='font-weight: bold;'>DevChat account.</span></p><a id='btn-reset' href='" 
          
          + "http://192.168.1.21:8080/#!/password/reset/" + user.id +

          "' target='_blank'>Reset Password</a><p style='margin-top: 10px;'>If you didn't request this link, you can simply ignore this email.</p><br/><p>Thank you.</p></div></body></html>"
      }, function(err, info) {
        if (err) return console.log(err);

        return console.log(info);
      });
    }
  });

	res.redirect('/');
});

router.post("/password/reset", function(req, res) {
  var id = req.param("id");
  var new_password = req.body.new_password;

  User.findOne({
    id: id
  }, function(err, user) {
    if (err || user === null) return res.send({
      code: 200,
      message: "Something went wrong. Please try again later."
    });

    if (user !== null) {
      user.id = uuid.v4();
      user.password = new_password;

      user.save();
    }

    return res.send({
      code: 200,
      message: "Reset password successfully."
    });
  });
});

router.post("/authentication/signout", function(req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/fail", function(req, res) {
  res.send("Fail.");
});

// Export router.
module.exports = router;
