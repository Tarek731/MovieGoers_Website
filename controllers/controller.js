// node packages
var express = require('express');
var passport = require('passport');
// setup router
var router = express.Router();
var fs = require("fs")
var inquirer = require("inquirer");
var Twitter = require('twitter');

var request = require('request');
// var command = process.argv[2];
// importing key from twitter keys file so keys are not shown in liri
// var omdbApiKey = keys.omdbApiKey;		
var keys = require('../public/assets/js/keys.js');
// keys already in key file
var client = new Twitter(keys.twitterKeys);
// var movie = process.argv[3];



var getTweets = new Promise( 
	function(resolve, reject) {
		var params = {screen_name: 'triharder23'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
			// console.log('response', response);
			console.log('tweets', tweets);
			if (!error) {
				console.log("succesful")
				console.log('tweetslenght', tweets.length);
				resolve( tweets);
			}
			else {
				reject( error);
				// return error;
			}
		})
	}
);

router.get ('/', function(req, res) {
	

	var data = {
		title: 'Movies',
		// tweets: tweetsList
	}


	if (req.isAuthenticated()) {
		res.redirect('/user');
	} else {
		console.log("finding bug");
		getTweets.then( function(tweetsList){
			console.log('wth', tweetsList)
		// passing tweets to handlebars page
			data.tweets = tweetsList;
			res.render('index', data);
		})
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


// function to test if user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;