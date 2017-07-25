// node packages
var express = require('express');
var request = require('request');
// setup router
var router = express.Router();

var models = require('../models');

router.get('/keyword', function(req, res){
	console.log("--------------------------")
	console.log("----------kjhghfjgdhgfdfsgfdzd----------------")
	console.log(req.body);
	res.send("work u bum")
// var queryKeyword = req.body.searchField;
// var queryURL = 'https://www.themoviedb.org/search?query='+queryKeyword;
// request(queryURL, function(err, response, body) {
// 		var dataObj = JSON.parse(body);
// 		var hbsObj = {
// 			title: "Movies - User",
// 			data: dataObj.Search
// 		};
// 		if (req.isAuthenticated()) {
// 			res.render('user', hbsObj);
// 		} else {
// 			res.render('index', hbsObj);
// 		}
// 	});
});

router.route('/watchlist/:movieId?')
	.get(isLoggedIn, function(req, res) {
		models.watchlist.findAll({ where: { userId: req.user.id }}).then(function(list) {
			console.log(list);
			var hbsObj = {
				title: 'Movies - watchlist',
				list: list
			};
			res.render('watchlist', hbsObj)
		});
	})
	.post(isLoggedIn, function(req, res) {
		models.watchlist.create(req.body).then(function(list) {
			console.log(list);
			var hbsObj = {
				title: 'Movies - watchlist',
				list: list
			};
			res.render('watchlist', hbsObj)
		});
	})
	.delete(isLoggedIn, function(req, res) {
		models.watchlist.destroy({ where: { id: req.params.movieId }}).then(function(list) {
			console.log(list);
			var hbsObj = {
				title: 'Movies - watchlist',
				list: list
			};
			res.render('watchlist', hbsObj)
		});
	});

router.get('/userData', isLoggedIn, function(req, res) {
	res.json(req.user);
});

// why???
// router.put('/movieSearch', function(req, res) {
router.post('/movieSearch', function(req, res) {
		var queryMovie = req.body.movie;
		var queryURL = 'http://www.omdbapi.com/?s='+queryMovie+'&y=&type=movie&r=json&apikey=40e9cece';
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

// the movie database keyword search

module.exports = router;

// function to test if user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}