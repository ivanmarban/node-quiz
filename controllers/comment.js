var models = require('../models/models.js');

exports.ownershipRequired = function(req, res, next) {
  models.Quiz.find({
    where: {
      id: Number(req.comment.QuizId)
    }
  }).then(function(quiz) {
    if (quiz) {
      var objQuizOwner = quiz.UserId;
      var logUser = req.session.user.id;
      var isAdmin = req.session.user.isAdmin;

      console.log(objQuizOwner, logUser, isAdmin);

      if (isAdmin || objQuizOwner === logUser) {
        next();
      } else {
        res.redirect('/');
      }
    } else {
      next(new Error('Nonexistent quizId ' + quizId))
    }
  }).catch(function(error) {
    next(error)
  });
};

exports.load = function(req, res, next, commentId) {
  models.Comment.find({
    where: {
      id: Number(commentId)
    }
  }).then(function(comment) {
    if (comment) {
      req.comment = comment;
      next();
    } else {
      next(new Error('Nonexistent commentId ' + commentId))
    }
  }).catch(function(error) {
    next(error)
  });
};

// GET /quizzes/:quizId/comments/new
exports.new = function(req, res) {
  res.render('comments/new.ejs', {
    page: 'comment-new',
    quizid: req.params.quizId,
    errors: []
  });
};

// POST /quizzes/:quizId/comments
exports.create = function(req, res) {

  var comment = models.Comment.build({
    text: req.body.comment.text,
    QuizId: req.params.quizId
  });

  comment
    .validate()
    .then(
      function(err) {
        if (err) {
          res.render('comments/new.ejs', {
            page: 'comment-create',
            comment: comment,
            errors: err.errors
          });
        } else {
          comment
            .save()
            .then(function() {
              res.redirect('/quizzes/' + req.params.quizId)
            })
        }
      }
    ).catch(function(error) {
      next(error)
    });

};

// GET /quizzes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
  req.comment.publish = true;

  req.comment.save({
      fields: ['publish']
    })
    .then(function() {
      res.redirect('/quizzes/' + req.params.quizId);
    })
    .catch(function(error) {
      next(error)
    });

};
