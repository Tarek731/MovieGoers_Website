// node packages
var express = require('express');
// setup router
var router = express.Router();


router.get('/', function(req, res) {
	res.render('index', { title: 'Movies - Login' });
});

module.exports = router;