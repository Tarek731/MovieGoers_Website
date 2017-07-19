var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user) {
	var User = user;
	var localStrategy = require('passport-local').Strategy;

	passport.use('local-signup', new localStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, username, password, done) {

		var generateHash = function(password) {
			return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
		};

		User.findOne({
			where: {
				username: username
			}
		}).then(function(user) {
			if (user) {
				return done(null, false, { message: 'That username is already taken' });
			} else {
				var userPassword = generateHash(password);

				var userData = {
					username: username,
					password: userPassword,
					email: req.body.email
				};

				User.create(userData).then(function(newUser, created) {
					if (!newUser) {
						return done(null, false);
					}

					if (newUser) {
						return done(null, newUser);
					}
				});
			}
		});
	}));
}