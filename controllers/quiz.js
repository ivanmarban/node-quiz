var models = require('../models/models.js');
var url = require('url');
var fs = require('fs');

exports.ownershipRequired = function(req, res, next) {
  var objQuizOwner = req.quiz.UserId;
  var logUser = req.session.user.id;
  var isAdmin = req.session.user.isAdmin;

  if (isAdmin || objQuizOwner === logUser) {
    next();
  } else {
    res.redirect('/');
  }
};

// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
    where: {
      id: Number(quizId)
    },
    include: [{
      model: models.Comment
    }]
  }).then(function(quiz) {
    if (quiz) {
      req.quiz = quiz;
      next();
    } else {
      next(new Error('Nonexistent quizId=' + quizId))
    }
  }).catch(function(error) {
    next(error)
  });
};

// GET /quizzes
// GET /users/:userId/quizzes
exports.index = function(req, res) {
  var options = {};
  var query = url.parse(req.url, true).query;

  if (JSON.stringify(query) != '{}' && query.search != '') {
    options = {
      where: ['question like ?', '%' + query.search.replace(/\s+/g, '%') + '%']
    };
    console.log(options);
  }

  var _page = 'quiz-index';
  if (req.user) {
    options.where = {
      UserId: req.user.id
    }
    _page = 'quiz-index-user';
  }

  models.Quiz.findAll(options).then(
    function(quizzes) {
      res.render('quizzes/index.ejs', {
        page: _page,
        quizzes: quizzes,
        errors: []
      });
    }
  ).catch(function(error) {
    next(error)
  });
};

// GET /quizzes/:id
exports.show = function(req, res) {
  res.render('quizzes/show', {
    page: 'quiz-show',
    quiz: req.quiz,
    errors: []
  });
};

// GET /quizzes/:id/answer
exports.answer = function(req, res) {
  var result = 'Wrong';
  if (req.query.answer === req.quiz.answer) {
    result = 'Wright';
  }
  res.render(
    'quizzes/answer', {
      page: 'quiz-answer',
      quiz: req.quiz,
      answer: result,
      errors: []
    }
  );
};

// GET /quizzes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build({
    question: 'Question text.',
    answer: 'Answer text.'
  });

  res.render('quizzes/new', {
    page: 'quiz-new',
    quiz: quiz,
    errors: []
  });
};

// POST /quizzes/create
exports.create = function(req, res) {

  req.body.quiz.UserId = req.session.user.id;
  if (req.files.image) {
    req.body.quiz.mimetype = req.files.image.mimetype;
    req.body.quiz.image = fs.readFileSync(req.files.image.path, { encoding: 'base64' });
  }

  var quiz = models.Quiz.build(req.body.quiz);

  quiz
    .validate()
    .then(
      function(err) {
        if (err) {
          res.render('quizzes/new', {
            page: 'quiz-new',
            quiz: quiz,
            errors: err.errors
          });
        } else {
          quiz
            .save({
              fields: ['question', 'answer', 'UserId', 'thematic', 'image']
            })
            .then(function() {
              res.redirect('/quizzes')
            })
        }
      }
    ).catch(function(error) {
      next(error)
    });

};

// GET /quizzes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;

  console.log(quiz);

  res.render('quizzes/edit', {
    page: 'quiz-edit',
    quiz: quiz,
    errors: []
  });
};

// PUT /quizzes/:id
exports.update = function(req, res) {
  if (req.files.image) {
    req.quiz.image = req.files.image.name;
  }
  req.quiz.question = req.body.quiz.question;
  req.quiz.answer = req.body.quiz.answer;
  req.quiz.thematic = req.body.quiz.thematic;

  req.quiz
    .validate()
    .then(
      function(err) {
        if (err) {
          res.render('quizzes/edit', {
            quiz: req.quiz,
            errors: err.errors
          });
        } else {
          req.quiz
            .save({
              fields: ['question', 'answer', 'thematic', 'image']
            })
            .then(function() {
              res.redirect('/quizzes');
            });
        }
      }
    ).catch(function(error) {
      next(error)
    });
};

// DELETE /quizzes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then(function() {
    res.redirect('/quizzes');
  }).catch(function(error) {
    next(error)
  });
};
