// node packages
var express = require('express');
// setup router
var router = express.Router();

// imported files
var controller = require('../controllers/controller.js');

router.route('/login')
	.get(controller.loginPage)
	.post(controller.login);

router.route('/sign-up')
	.get(controller.signUpPage)
	.post(controller.login);

module.exports = router;