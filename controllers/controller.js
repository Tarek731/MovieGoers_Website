module.exports = {
	signUpPage: function(req, res) {
		res.render('sign-up', {title: 'Movies - Sign Up'});
	},
	loginPage: function(req, res) {
		res.render('login', { title: 'Movies - Login' });
	},
	login: function(req, res) {
		res.send('logged in');
	}
}