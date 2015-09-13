exports.loginRequired = function(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};

// Get /login
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {
		page : 'login',
		errors: errors
	});
};

// POST /login
exports.create = function(req, res) {

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user');
	userController.auth(login, password, function(error, user) {

		if (error) {
			req.session.errors = [{
				'message': 'There was an error: ' + error
			}];

			res.redirect("/login");
			return;
		}

		req.session.user = {
			id: user.id,
			username: user.username,
			isAdmin: user.isAdmin
		};

		res.redirect(req.session.redir.toString());
	});
};

// DELETE /logout 
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect('/');
};