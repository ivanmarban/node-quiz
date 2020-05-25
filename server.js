var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  partials = require('express-partials'),
  methodOverride = require('method-override'),
  session = require('express-session'),
  debug = require('debug')('quiz'),
  dotenv = require('dotenv');

var app = express();
var env = process.env.NODE_ENV || 'dev';

if (env == 'dev') {
  dotenv.load();
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser('node-quiz'));
app.use(session({
  secret: 'qwertyuiop',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 120000
  }
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  if (!req.session.redir) {
    req.session.redir = '/';
  }
  if (!req.path.match(/\/login|\/logout|\/user/)) {
    req.session.redir = req.path;
  }
  res.locals.session = req.session;
  next();
});

app.use('/', require('./routes/index'));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
