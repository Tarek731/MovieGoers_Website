// node packages
var express = require('express');
var exphbs = require('express-handlebars');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var path = require('path');

// imported files
var userRoutes = require('./controllers/userController.js');
var apiRoutes = require('./controllers/apiController.js')
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
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// static folder
app.use(express.static(path.join(__dirname + '/public')));
app.use('/api', express.static(path.join(__dirname + '/public')));
// routes
app.use('/', userRoutes);
app.use('/api', apiRoutes);

// passport strategy
require('./config/passport/passport.js')(passport, models.user);

// setup server to sync models and listen
models.sequelize.sync().then(function() {
	app.listen(port, function() {
		console.log('Server listening on PORT ' + port);
	});
});