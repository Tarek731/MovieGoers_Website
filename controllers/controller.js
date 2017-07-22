// node packages
var express = require('express');
var passport = require('passport');
//====parendu added user require

var user = require("../models/user.js");
var app = express();

app.get('/', function(req, res){
	res.render('user');
})

//======

// setup router
var router = express.Router();

router.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/user');
	} else {
		res.render('index', { title: 'Movies' });
	}
})

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

router.route('/sign-up')
	.get(function(req, res) {
		res.render('sign-up', { title: 'Movies - Sign Up' });
	})
	.post(passport.authenticate('local-signup', {
		successRedirect: '/user',
		failureRedirect: '/sign-up'
	}));

router.get('/user', isLoggedIn, function(req, res) {
	res.render('user', { title: 'Movies - User' })
});

//parendu added
//add watchlist movie
// router.post('/user', function(req, res){
// 	user.create(req.body.title, function(result){
// 		res.redirect('/user');
// 	});
// });

//parendu added
//display watchlist
// router.get('/watchlist', function(req, res) {
// 	burger.selectAll(function(data) {
// 		var hbsObject = {watchlist: data};
// 		console.log(hbsObject);
// 		res.render('watchlist.handlebars', hbsObject);
// 	});
// });






module.exports = router;

// function to test if user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}