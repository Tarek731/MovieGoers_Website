// node packages
var express = require('express');
var passport = require('passport');

// setup router
var router = express.Router();

router.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/user');
	} else {
		res.render('index', { title: 'Movies' });
	}
});

router.route('/sign-up')
	.get(function(req, res) {
		res.render('sign-up', { title: 'Movies - Sign Up' });
	})
	.post(passport.authenticate('local-signup', {
		successRedirect: '/user',
		failureRedirect: '/sign-up'
	}));

router.route('/login')
	.get(function(req, res) {
		res.render('login', { title: 'Movies - Login' });
	})
	.post(passport.authenticate('local-login', {
		successRedirect: '/user',
		failureRedirect: '/login'
	}));

router.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		res.redirect('/');
	});
});

router.get('/user', isLoggedIn, function(req, res) {
	res.render('user', { title: 'Movies - User' })
});

module.exports = router;

// function to test if user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}