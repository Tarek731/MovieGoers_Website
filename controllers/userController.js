// node packages
var express = require('express');
var passport = require('passport');
var fs = require("fs")
var Twitter = require('twitter');

// setup router
var router = express.Router();

var request = require('request');
// var command = process.argv[2];
// importing key from twitter keys file so keys are not shown in liri
// var omdbApiKey = keys.omdbApiKey;		
var keys = require('../public/assets/js/keys.js');
// keys already in key file
var client = new Twitter(keys.twitterKeys);
// var movie = process.argv[3];

router.get('/keyword', function(req, res){
	console.log("--------------------------")
	console.log("----------kjhghfjgdhgfdfsgfdzd----------------")
	console.log(req.body);
	res.send("work u bum")
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

var getTweets = new Promise( 
	function(resolve, reject) {
		var params = {screen_name: 'triharder23'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
			// console.log('response', response);
			//console.log('tweets', tweets);
			if (!error) {
				// console.log("succesful")
				// console.log('tweetslenght', tweets.length);
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
		});
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

	res.render('user', { title: 'MovieGoers - '+req.user.username, username: req.user.username })

});

//pp trying to display popular movie on user page
// router.route('/sign-up')
// 	.get(function(req, res) {
// 		res.render('sign-up', { title: 'Movies - Sign Up' });
// 	})
// 	.post(passport.authenticate('local-signup', {
// 		successRedirect: '/api/user',
// 		failureRedirect: '/sign-up'
// 	}));

// router.route('/login')
// 	.get(function(req, res) {
// 		res.render('login', { title: 'Movies - Login' });
// 	})
// 	.post(passport.authenticate('local-login', {
// 		successRedirect: '/api/user',
// 		failureRedirect: '/login'
// 	}));

// router.get('/logout', function(req, res) {
// 	req.session.destroy(function(err) {
// 		res.redirect('/');
// 	});
// });

// router.get('/api/user', isLoggedIn, function(req, res) {

// 	res.render('user', { title: 'MovieGoers - '+req.user.username, username: req.user.username })

// });






module.exports = router;

// function to test if user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}