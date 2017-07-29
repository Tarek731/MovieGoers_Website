// node packages
var express = require('express');
var request = require('request');
var rp = require('request-promise');

// setup router
var router = express.Router();

var models = require('../models');

// Tarek: the movie database keyword search
router.post('/keyword', function(req, res){
	console.log("--------------------------")
	console.log("----------kjhghfjgdhgfdfsgfdzd----------------")
	
	
	var queryKeyword = req.body.searchField;
	console.log(queryKeyword);
	// var queryURL = 'https://www.themoviedb.org/search?query='+queryKeyword;
	var queryURL = 'https://api.themoviedb.org/3/search/person?api_key=1cf863948f045b7f12721d5ee2275e8b&language=en-US&query=' + queryKeyword + '&page=1&include_adult=true';
	request(queryURL, function(err, response, body) {
		var dataObj = JSON.parse(body);

		var movieTitles = []; 
		for (var i = 0; i < dataObj.results.length; i++) {
			var results = dataObj.results[i];
			for (var j = 0; j < results.known_for.length; j++) {
				title = results.known_for[j].title;
				console.log(title);
				if (title) {
					movieTitles.push({
						movieTitle: title
					});
				}
			}
		}


		var moviePosterPath = []; 
		for (var i = 0; i < dataObj.results.length; i++) {
			var results = dataObj.results[i];
			for (var j = 0; j < results.known_for.length; j++) {
				posterPath = results.known_for[j].posterPath;
				console.log(posterPath);
				if (posterPath) {
					moviePosterPath.push({
						moviePosterPath: posterPath
					});
				}
			}
		}

		console.log(movieTitles);

		// var movieTitle = dataObj.results[0].known_for[0].title;
		// console.log(movieTitle);
		var posterPath = dataObj.results[0].known_for[0].poster_path;
		// console.log(posterPath);
		var hbsObj = {

			movieTitles: movieTitles,
			moviePosterPath: posterPath

			
		};

		res.render('index' , hbsObj);

		// if (req.isAuthenticated()) {
		// 	res.render('user', hbsObj);
		// } else {
		// 	res.render('index', hbsObj);
		// }
	});
});

// user and watchlist pages api
router.route('/watchlist/:movieID?')
	.get(isLoggedIn, function(req, res) {
		models.watchlist.findAll({ where: { userId: req.user.id }}).then(function(list) {
           	// console.log(list);
			// console.log(JSON.stringify(list));
       //updated by parendu to make work watchlist page        
			var watchlist = JSON.stringify(list);

			var dataObj = JSON.parse(watchlist);
             
			console.log(dataObj);
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
		
		var movie = {};
		var movieId = req.body.movieID;
		// console.log('movieID', movieId)
		//var queryURL = 'http://www.omdbapi.com/?i='+movieId+'&y=&type=movie&r=json&apikey=40e9cece';
		//pp added 
		var queryURL = 'https://api.themoviedb.org/3/movie/'+movieId+'?api_key=85b3a680df0c4f07bb1e32b948cbe4c6&language=en-US'
		
		// console.log('queryURL', queryURL)
        //updated by pp - added new fields based on themoviedb
		request(queryURL, function(err, response, body) {
			body = JSON.parse(body);
			// console.log('body', body)
			movie = {
				title: body.title,
				release_date: body.release_date,
				overview: body.overview,
				popularity: body.popularity,
				vote_average: body.vote_average,
				movieId: body.id,
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
		// console.log("~~~~~~~~~~~~~~~~~~~")

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

//Search movie using themoviedb
router.put('/movieSearch', function(req, res) {
	var queryMovie = req.body.movie;
	//var queryURL = 'http://www.omdbapi.com/?s='+queryMovie+'&y=&type=movie&r=json&apikey=40e9cece';
  //pp
   var queryURL = 'http://api.themoviedb.org/3/search/movie?api_key=85b3a680df0c4f07bb1e32b948cbe4c6&query=' +queryMovie
	
        request(queryURL, function(err, response, body) {
		// console.log(body);
		
		var dataObj = JSON.parse(body);
		// console.log(dataObj);
		var hbsObj = {
			title: "MovieGoers - User",
			searchResult: "searchResult",
			movieSearch: queryMovie,
			data: dataObj.results
		};
		// console.log("hbsObj1:" +hbsObj);
		if (req.isAuthenticated()) {

			res.render('user', hbsObj);
			
		} else {
			res.render('index', hbsObj);
		}
	});
});

		//pp -  now working popular movie img is broken

var options = {
    uri: 'https://api.themoviedb.org/3/discover/movie?api_key=85b3a680df0c4f07bb1e32b948cbe4c6&sort_by=popularity.desc&include_adult=true',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response 
};
 
 router.get('/popular', function(req, res, next) {
rp(options)
    .then(function (body) { 
        console.log(body.results);
         var hbsObj = {data: body.results,
		               poster: body.results.poster_path,
		               username: req.user.username};
	              //  res.json(body);
		        console.log("hbsObj:===========" + body.results);
		        res.render('popular', hbsObj);
		       // res.redirect('/api/popular');
    })
    .catch(function (err) {
        // API call failed... 
    });
});

//pp trying to load latest movies on user page
var options = {
    uri: 'http://api.themoviedb.org/3/movie/upcoming?api_key=85b3a680df0c4f07bb1e32b948cbe4c6&sort_by=release_date.desc',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response 
};
 
 router.get('/user', function(req, res, next) {
rp(options)
    .then(function (body) {
        
        console.log(body.results);
        
         var hbsObj = {data: body.results,
		               poster: body.results.poster_path,
		               username: req.user.username};

		        
		        // 
		      //  res.json(body);
		        console.log("hbsObj:===========" + body.results);
		        res.render('user', hbsObj);
		       // res.redirect('/api/popular');
    })
    .catch(function (err) {
        // API call failed... 
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

