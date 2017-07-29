// node packages
var express = require('express');
var passport = require('passport');
var fs = require("fs")
var Twitter = require('twitter');
var request = require('request');

// setup router
var router = express.Router();

var keys = require('../public/assets/js/keys.js');
// keys already in key file
var client = new Twitter(keys.twitterKeys);

var getTweets = new Promise( 
	function(resolve, reject) {
		var params = {screen_name: 'triharder23'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
			if (!error) {
				resolve( tweets);
			}
			else {
				// return error;
				reject( error);
			}
		});
	}
);

router.get('/keyword', function(req, res){
	var queryKeyword = req.body.searchField;
	var queryURL = 'https://www.themoviedb.org/search?query='+queryKeyword;
	request(queryURL, function(err, response, body) {
		var dataObj = JSON.parse(body);
		var hbsObj = {
			title: "Movies - User",
			data: dataObj.Search
		};
		if (req.isAuthenticated()) {
			res.render('user', hbsObj);
		} else {
			res.render('index', hbsObj);
		}
	});
});

router.get ('/', function(req, res) {
	var data = {
		title: 'Movies',
	}

	if (req.isAuthenticated()) {
		res.redirect('/user');
	} else {
		// getTweets.then( function(tweetsList){
		// 	// passing tweets to handlebars page
		// 	data.tweets = tweetsList;
			res.render('index', data);
		//});
	}
});

//pp - user route path changed from /user to /api/user to display coming soon
//movies
router.route('/sign-up')
	.get(function(req, res) {
		res.render('sign-up', { title: 'Movies - Sign Up' });
	})
	.post(passport.authenticate('local-signup', {
		successRedirect: '/api/user',
		failureRedirect: '/sign-up'
	}));

router.route('/login')
	.get(function(req, res) {
		res.render('login', { title: 'Movies - Login' });
	})
	.post(passport.authenticate('local-login', {
		successRedirect: '/api/user',
		failureRedirect: '/login'
	}));

router.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		res.redirect('/');
	});
});

router.get('/user', isLoggedIn, function(req, res) {
	res.render('user', { title: 'MovieGoers - '+req.user.username, username: req.user.username })
});

module.exports = router;

// function to test if user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}