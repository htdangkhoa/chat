var bcrypt = require("bcryptjs"),
    mongoose = require("mongoose"),
    uuid = require("uuid"),
    uniqid = require("uniqid"),
    Schema = mongoose.Schema,
    salt_rounds = 10;

var User = new Schema({
    _id: {
    	type: Schema.Types.ObjectId,
    	default: function () {
            return mongoose.Types.ObjectId()
        }
    },
    session: {
        type: String,
        default: function() {
            return uuid.v4()
        }
    },
    username: {
        type: String,
        default: function() {
            return uniqid("User-");
        }
    },
    email: {
    	type: String,
    	required: true,
    	unique: true
    },
    password: {
    	type: String,
    	required: true
    },
    directs: {
        type: Array,
        default: []
    },
    channels: {
        type: Array,
        default: []
    }
});

//Hash password before insert to schema.
User.pre('save', function(next) {
    var user = this;

    //Only hash the password if it has been modified (or is new).
    if (!user.isModified('password')) {
    	return next();
    }

    //Generate a salt.
    bcrypt.genSalt(salt_rounds, function(err, salt) {
        if (err) return next(err);

        //Hash the password using our new salt.
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            console.log(hash)
            //Override the cleartext password with the hashed one.
            user.password = hash;
            next();
        });
    });
});

User.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//Export modules.
module.exports = mongoose.model("user", User);
