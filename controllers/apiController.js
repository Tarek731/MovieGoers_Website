// node packages
var express = require('express');
//var passport = require('passport');
// setup router
var router = express.Router();

var models = require('../models');

router.route('/watchlist/:movieId?')
	.get(isLoggedIn, function(req, res) {
		models.watchlist.findAll({ where: { userId: req.user.id }}).then(function(list) {
			res.json(list);
		});
	})
	.post(isLoggedIn, function(req, res) {
		models.watchlist.create(req.body).then(function(list) {
			res.json(list);
		});
	})
	.delete(isLoggedIn, function(req, res) {
		models.watchlist.destroy({ where: { id: req.params.movieId }}).then(function(list) {
			res.json(list);
		});
	});

router.get('/api/userData', isLoggedIn, function(req, res) {
	res.json(req.user);
});

module.exports = router;

// function to test if user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}