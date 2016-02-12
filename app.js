/**
 * app.js
 * entry point for the entire app
 * @author albert
 */

'use strict';

// load config + utilities
var config = require('./config');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var mongoose = require('mongoose');

// load express modules and middleware
var subdomain = require('express-subdomain');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var csrf = require('csurf');
var passport = require('passport');
var error = require('./error');

var serveStatic = require('serve-static');

// custom middleware
var middleware = require('./middleware');

// load express
var app = express();
var server = http.createServer(app);

// set up gridfs
require('./gridfs');

// connect to db
require('./db');

// set up schedules
require('./schedule');

// set up websocket/polling server
require('./socket')(server);

// set up zeromq binding
require('./mq');
// set up zeromq notification listeners
require('./controllers/notifications/index')();

// set up apple push notifications
require('./apn');

// MIDDLEWARE

// cors
app.use(middleware.cors);

app.use(favicon('./public/img/favicon.ico'));

// logger
var access_log_stream = fs.createWriteStream(__dirname + '/log/access.log', {flags: 'a'});
app.use(logger('dev', { stream: access_log_stream }));

// form parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(methodOverride());

// sessions
app.use(cookieParser('sacklapbur'));
app.use(session({
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  secret: 'burlapsack',
  cookie: {
    secret: true,
    expires: false,
    domain: config.app.server.domain,
    path: '/',
    secure: false,
    httpOnly: false
  },
  resave: false,
  saveUninitialized: false
}));

// passport
// load strategies and config
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());


// disable csurf until we need it
//app.use(csrf());
//app.use(function(req, res, next) {
//  res.locals.csrf = req.csrfToken();
//  return next();
//});

// templating engine for pages outside of the SPA
app.set('view engine', 'jade');
app.set('views', './views');

// load api routes onto api.bevy subdomain
// TODO: user auth
// TODO: multi level api (v1, v2, etc)
var api_router = express.Router();

api_router.use(middleware.cors);
require('./routes/api')(api_router);
api_router.use(error.log_errors);
api_router.use(error.error_handler);
app.use(subdomain('api', api_router));
app.use('/api', api_router);
//app.use(subdomain('*', api_router));


// static directories
app.use(serveStatic(__dirname + '/public')); // app-specific assets

// load routes
var routes = require('./routes')(app);

// error handling
app.use(error.log_errors);
app.use(error.error_handler);

server.listen(config.app.server.port);
console.log('http server listening on port', config.app.server.port);
//https.createServer(config.app.ssl_opts, app).listen(443);
//console.log('https server listening on port', 443);
