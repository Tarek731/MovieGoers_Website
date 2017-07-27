// node packages
var express = require('express');
var request = require('request');

// setup router
var router = express.Router();

var models = require('../models');

// the movie database keyword search
router.post('/keyword', function(req, res){
	console.log("--------------------------")
	console.log("----------kjhghfjgdhgfdfsgfdzd----------------")
	console.log('req.body', req.body);
	
	
	var queryKeyword = req.body.searchField;
	console.log(queryKeyword);
	// var queryURL = 'https://www.themoviedb.org/search?query='+queryKeyword;
	var queryURL = 'https://api.themoviedb.org/3/movie/'+queryKeyword+'/keywords?api_key=1cf863948f045b7f12721d5ee2275e8b';
	request(queryURL, function(err, response, body) {
		var dataObj = JSON.parse(body);
		console.log(dataObj);
		var hbsObj = {
			title: "MovieGoers - User",
			data: dataObj.Search
		};
		if (req.isAuthenticated()) {
			res.render('user', hbsObj);
		} else {
			res.render('index', hbsObj);
		}
	});
});

router.route('/watchlist/:movieID?')
// router.route('/watchlist/:id?')
	.get(isLoggedIn, function(req, res) {
		models.watchlist.findAll({ where: { userId: req.user.id }}).then(function(list) {
           	// console.log(list);
			// console.log(JSON.stringify(list));
       //updated by parendu to make work watchlist page        
			var watchlist = JSON.stringify(list);

			var dataObj = JSON.parse(watchlist);

			// console.log(dataObj);
			var hbsObj = {
				title: 'MovieGoers - watchlist',
				username: req.user.username,
				watchlist: dataObj
			};
			res.render('watchlist', hbsObj);
            // console.log("hbsObj:" + hbsObj);
		});
	})
	//added by pp
	.post(isLoggedIn, function(req, res) {
		debugger
		var movie = {};
		var movieId = req.body.movieID;
		console.log('movieID', movieId)
		//var queryURL = 'http://www.omdbapi.com/?i='+movieId+'&y=&type=movie&r=json&apikey=40e9cece';
		//pp added 
		var queryURL = 'https://api.themoviedb.org/3/movie/'+movieId+'?api_key=85b3a680df0c4f07bb1e32b948cbe4c6&language=en-US'
		
		console.log('queryURL', queryURL)

		request(queryURL, function(err, response, body) {
			body = JSON.parse(body);
			console.log('body', body)
			movie = {
				title: body.title,
				// year: body.Year,
				movieId: body.imdb_id,
				poster: body.poster_path,
				userId: req.user.id
			}
			models.watchlist.findOrCreate({ where: movie }).then(function(data) {
				console.log('POST /api/watchlist: end of response')
				res.JSON(data)
				// console.log(data);
			});
		});
		
	})
	.delete(isLoggedIn, function(req, res) {
		console.log(req.body.id)
		console.log("~~~~~~~~~~~~~~~~~~~")

		models.watchlist.destroy({ where: { id: req.body.id }}).then(function() {
			
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
	//var queryURL = 'http://www.omdbapi.com/?s='+queryMovie+'&y=&type=movie&r=json&apikey=40e9cece';
  //pp
   var queryURL = 'http://api.themoviedb.org/3/search/movie?api_key=85b3a680df0c4f07bb1e32b948cbe4c6&query=' +queryMovie
	
	request(queryURL, function(err, response, body) {
		console.log(body);
		
		var dataObj = JSON.parse(body);
		console.log(dataObj);
		
		var hbsObj = {
			title: "MovieGoers - User",
			
			movieSearch: queryMovie,
			// data: dataObj.Search
			data: dataObj.results
		};

		console.log("hbsObj1:" +hbsObj);

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