var express = require('express'),
	multer = require('multer'),
	router = express.Router();

var quizController = require('../controllers/quiz');
var commentController = require('../controllers/comment');
var sessionController = require('../controllers/session');
var userController = require('../controllers/user');
var statisticsController = require('../controllers/statistics');

router.get('/', function(req, res) {
	res.render('index', {
		page : 'home',
		title: 'node-quiz',
		errors: []
	});
});

router.get('/author', function(req, res) {
	res.render('author', {
		page : 'about',
		errors: []
	});
});

router.get('/statistics',statisticsController.calculate);

router.param('quizId', quizController.load);
router.param('commentId', commentController.load);
router.param('userId', userController.load);

router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

router.get('/user', userController.new);
router.post('/user', userController.create);
router.get('/user/:userId(\\d+)/edit', sessionController.loginRequired, userController.ownershipRequired, userController.edit);
router.put('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.update);
router.delete('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.destroy);
router.get('/user/:userId(\\d+)/quizzes', quizController.index);


router.get('/quizzes', quizController.index);
router.get('/quizzes/:quizId(\\d+)', quizController.show);
router.get('/quizzes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizzes/new', sessionController.loginRequired, quizController.new);
router.post('/quizzes/create', sessionController.loginRequired, multer({
	dest: './public/media/'
}), quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.ownershipRequired, quizController.edit);
router.put('/quizzes/:quizId(\\d+)', sessionController.loginRequired, quizController.ownershipRequired, multer({
	dest: './public/media/'
}), quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.ownershipRequired, quizController.destroy);


router.get('/quizzes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizzes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',sessionController.loginRequired, commentController.ownershipRequired, commentController.publish);

module.exports = router;