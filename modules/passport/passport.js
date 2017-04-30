//Declare modules.
var User = require("../models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy;

//Create passport strategy.
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  },
  function(email, password, done) {
  	User.findOne({
  		email: email
  	}).then(function(user){
  		if (!user){
  			return done(null, false);
  		}

      user.comparePassword(password, function(err, isMatch) {
          if (err) {
            return done(err);
          }

          if (!isMatch) {
            return done(null, false);
          }

          return done(null, user)
      });
  	}, function(error){
  		return done(error);
  	});
  }
));

//Create serializeUser.
passport.serializeUser(function(user, done) {
	// console.log(user)
  done(null, user.session);
});

//Create deserializeUser.
passport.deserializeUser(function(session, done) {
	User.findOne({
		session: session
	}).then(function(user){
  		if (!user){
  			return done(null, false);
  		}else{
  			return done(null, user);
  		}
  	}, function(error){
  		return done(error);
  	});
});

//Export module passport.
module.exports.passport = passport;