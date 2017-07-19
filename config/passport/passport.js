var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user) {
	var User = user;
	var localStrategy = require('passport-local').Strategy;

	// local sign-up strategy
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

	// serialize user
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// deserialize user
	passport.deserializeUser(function(id, done) {
		User.findById(id).then(function(user) {
			if (user) {
				done(null, user.get());
			} else {
				done(user.errors, null);
			}
		});
	});

	// local login strategy
	passport.use('local-login', new localStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, username, password, done) {
		var User = user;

		var isValidPassword = function(userPass, password) {
			return bCrypt.compareSync(password, userPass);
		}

		User.findOne({
			where: {
				username: username
			}
		}).then(function(user) {
			if (!user) {
				return done(null, false, { message: 'Username does not exist.' });
			}

			if (!isValidPassword(user.password, password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}

			var userInfo = user.get();
			return done(null, userInfo);

		}).catch(function(err) {
			console.log('Error: ' + err);
			return done(null, false, { message: 'Something went wrong with your login.' });
		});
	}));
}