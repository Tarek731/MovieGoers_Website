// node packages
var express = require('express');
var request = require('request');

// setup router
var router = express.Router();

var models = require('../models');

router.route('/watchlist/:movieId?')
	.get(isLoggedIn, function(req, res) {
		models.watchlist.findAll({ where: { userId: req.user.id }}).then(function(list) {
           	console.log(list);
			// console.log(JSON.stringify(list));
       //updated by parendu to make work watchlist page        
			var watchlist = JSON.stringify(list);

			var dataObj = JSON.parse(watchlist);

			console.log(dataObj);
			var hbsObj = {
				title: 'Movies - watchlist',
				watchlist: dataObj
			};
			res.render('watchlist', hbsObj);
            console.log("hbsObj:" + hbsObj);
		});
	})


	//added by pp
	.post(isLoggedIn, function(req, res) {
		var movie = {};
		var movieId = req.body.imdbID;
		var queryURL = 'http://www.omdbapi.com/?i='+movieId+'&y=&type=movie&r=json&apikey=40e9cece';
		request(queryURL, function(err, response, body) {
			body = JSON.parse(body)
			movie = {
				title: body.Title,
				year: body.Year,
				imdbId: body.imdbID,
				poster: body.Poster,
				userId: req.user.id
			}
			models.watchlist.create(movie).then(function(list) {
	
			});
		});
		
	})

	
	.delete(isLoggedIn, function(req, res) {
		models.watchlist.destroy({ where: { id: req.params.movieId }}).then(function() {
			
			//added by pp
		
			// var hbsObj = {
			// 	title: 'Movies - watchlist',
			// 	watchlist: list
			// };
			// res.render('watchlist', hbsObj);
			res.redirect('/api/watchlist');
		});
	});

router.get('/userData', isLoggedIn, function(req, res) {
	res.json(req.user);
});

//Search movie using omdapi
router.put('/movieSearch', function(req, res) {
	var queryMovie = req.body.movie;
	var queryURL = 'http://www.omdbapi.com/?s='+queryMovie+'&y=&type=movie&r=json&apikey=40e9cece';
	request(queryURL, function(err, response, body) {
		var dataObj = JSON.parse(body);
		var hbsObj = {
			title: "Movies - User",
			movieSearch: queryMovie,
			data: dataObj.Search
		};

		console.log(hbsObj);

		if (req.isAuthenticated()) {
			res.render('user', hbsObj);
		} else {
			res.render('index', hbsObj);
		}
	});
});


module.exports = router;

// function to test if user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}