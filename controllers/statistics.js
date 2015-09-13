var models = require('../models/models.js');

exports.calculate = function(req, res, next) {
	var with_comments = [];
	var no_comments;
	models.Quiz.count().then(function(quizzes) {
		models.Comment.findAll({
			where: {
				publish: true
			}
		}).then(function(comments) {
			no_comments = quizzes;
			for (var i = 0; i < comments.length; i++) {
				if (with_comments[comments[i].QuizId] === undefined) {
					no_comments--;
				}
				with_comments[comments[i].QuizId] = 1;
			}
			res.render('statistics', {
				page : 'statistics',
				quizzes: quizzes,
				comments: comments.length,
				avg: comments.length / quizzes,
				without_comments: no_comments,
				with_comments: quizzes - no_comments,
				errors: []
			});
		});
	});
}