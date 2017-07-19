// node packages
var express = require('express');
var exphbs = require('express-handlebars');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');

// imported files
var router = require('./controllers/controller.js');
var models = require('./models');

// set port
var port = process.env.PORT || 8080;

// setup express
var app = express();
// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// method override
app.use(methodOverride('_method'));
// handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// passport
app.use(session({
	secret: 'super secret',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// static folder
app.use(express.static(__dirname + '/public'));
// routes
app.use('/', router);

// setup server to sync models and listen
models.sequelize.sync({ force: true }).then(function() {
	app.listen(port, function() {
		console.log('Server listening on PORT ' + port);
	});
});