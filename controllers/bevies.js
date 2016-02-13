/**
 * bevies.js
 * API for bevies
 * @author albert
 * @flow
 */

'use strict';

// imports
var mongoose = require('mongoose');
var error = require('./../error');
var _ = require('underscore');
var shortid = require('shortid');
var async = require('async');
var getSlug = require('speakingurl');
var bcrypt = require('bcryptjs');
var config = require('./../config');

var User = require('./../models/User');
var Bevy = require('./../models/Bevy');
var Post = require('./../models/Post');
var Board = require('./../models/Board');
var ResetToken = require('./../models/ResetToken');
var InviteToken = require('./../models/InviteToken');

var emailController = require('./email');

var userPopFields = '_id displayName email image username created';
var boardPopFields = '_id name description parent image subCount type admins settings created';

//GET /bevies
exports.getPublicBevies = function(req, res, next) {
  Bevy.find(function(err, bevies) {
    if(err) return next(err);
    return res.json(bevies);
  })
  .populate({
    path: 'admins',
    select: userPopFields
  })
  .populate({
    path: 'boards',
    select: boardPopFields
  })
  .limit(20);
}

/**
 * POST /bevies
 * ------------
 * REALLY BIG FUNCTION
 * sets up an entire new bevy, admin user, and boards
 *
 */
var createBevy = function(req, res, next) {
  // first we need to collect the params needed to create the super-admin for the bevy
  var admin_email = req.body['admin_email'];
  var admin_username = req.body['admin_username'];
  if(_.isEmpty(admin_email)) return next('Bevy admin email not defined');
  if(_.isEmpty(admin_username)) return next('Bevy admin username not defined');

  // then collect the required params for the bevy
  var bevy_name = req.body['bevy_name'];
  var bevy_slug = req.body['bevy_slug'];
  var bevy_image = req.body['bevy_image'];

  if(_.isEmpty(bevy_name)) return next('Bevy name not specified');
  if(_.isEmpty(bevy_slug)) return next('Bevy slug not specified');
  if(_.isEmpty(bevy_image)) {
    // if the image is empty, then generate a default one
    bevy_image = {
      filename: config.app.server.hostname + '/img/default_group_img.png',
      foreign: true
    };
  }

  // get the array of user emails to invite to the new bevy
  var invite_emails = req.body['invite_emails'];
  // this is allowed to be empty
  if(_.isEmpty(invite_emails)) invite_emails = [];

  // oh boy time to do a bunch of risky async stuff
  // better use waterfall so if anything messes up it won't get worse
  async.waterfall([
    // create the admin user first
    function(done) {
      var new_user = {
        _id: shortid.generate(),
        email: admin_email,
        // create temporary username. this will be changed
        // later in the creation flow
        username: admin_username,
        // create and hash a random password so the user can't be logged into
        // without first clicking on the pass reset link
        password: bcrypt.hashSync(shortid.generate(), 8),
        // create a temp bevy ref so the database won't freak out
        // we'll fill this in later in this async waterfall
        bevy: 'barf',
        created: Date.now()
      };
      User.create(new_user, function(err, user) {
        if(err) return done(err);
        // user successfully created, lets move on
        return done(null, user);
      });
    },
    // now lets create the new bevy
    function(user, done) {
      var new_bevy = {
        _id: shortid.generate(),
        name: bevy_name,
        slug: bevy_slug,
        image: bevy_image,
        // make the admin of the bevy the user
        // that we just created
        admins: [ user._id ],
        subCount: 1,
        created: Date.now()
      };
      Bevy.create(new_bevy, function(err, bevy) {
        if(err) return done(err);
        // bevy successfully created, move on
        return done(null, user, bevy);
      });
    },
    // link the newly created user with the newly created bevy
    function(user, bevy, done) {
      user.bevy = bevy._id;
      // and flush to db
      user.save(function(err) {
        if(err) return done(err);
        return done(null, user, bevy);
      });
    },
    // lets create some boards for this new bevy
    function(user, bevy, done) {
      // default announcement board
      var announcement_board = {
        _id: shortid.generate(),
        name: 'Announcements',
        description: 'An announcements board. Only admins can post here, \
                      and every bevy member gets a notification when a post is made here.',
        image: {
          filename: config.app.server.hostname + '/img/default_board_img.png',
          foreign: true
        },
        parent: bevy._id,
        type: 'announcement',
        admins: [ user._id ],
        subCount: 1,
        created: Date.now()
      };
      // default discussion board
      var discussion_board = {
        _id: shortid.generate(),
        name: 'Discussion',
        description: 'An discussion board. Notifications are sent less often and everyone \
                      can post and comment here',
        image: {
          filename: config.app.server.hostname + '/img/default_board_img.png',
          foreign: true
        },
        parent: bevy._id,
        type: 'discussion',
        admins: [ user._id ],
        subCount: 1,
        created: Date.now()
      };
      // flush to db
      Board.create([ announcement_board, discussion_board ], function(err, boards) {
        if(err) return done(err);
        // boards created successfully, move on
        return done(null, user, bevy, boards);
      });
    },
    // link the newly created boards to the new bevy
    function(user, bevy, boards, done) {
      bevy.boards = [ boards[0]._id, boards[1]._id ];
      // and flush to db
      bevy.save(function(err) {
        if(err) return done(err);
        // bevy saved successfully, move on
        return done(null, user, bevy);
      });
    },
    // TODO: create a post and some comments for each board? maybe????
    // create a reset token for so the new admin can change his/her password
    function(user, bevy, done) {
      var token = {
        _id: shortid.generate(),
        user: user._id,
        token: shortid.generate(),
        created: Date.now()
      };
      ResetToken.create(token, function(err, resetToken) {
        if(err) return done(err);
        // token saved successfully, move on
        return done(null, user, bevy, resetToken);
      });
    },
    // send the welcome email to the new admin
    function(user, bevy, resetToken, done) {
      emailController.sendEmail(user.email, 'welcome', {
        user_email: user.email,
        bevy_name: bevy.name,
        bevy_slug: bevy.slug,
        pass_link: config.app.server.hostname + '/reset/' + resetToken.token
      }, function(err, result) {
        if(err) return next(err);
        // email queued successfully, move on
        return done(null, user, bevy);
      });
    },
    // create invite tokens for all invited users
    function(user, bevy, done) {
      if(_.isEmpty(invite_emails)) return done(null, user, bevy);
      // loop thru all invited users
      async.each(invite_emails, function(invite_email, callback) {
        // define new token object
        var new_token = {
          _id: shortid.generate(),
          token: shortid.generate(),
          email: invite_email,
          created: Date.now()
        };
        // flush to db
        InviteToken.create(new_token, function(err, invite_token) {
          if(err) return callback(err);
          // then send invite emails to all invited users
          emailController.sendEmail(invite_email, 'invite', {
            user_email: invite_email,
            bevy_name: bevy.name,
            bevy_slug: bevy.slug,
            invite_link: 'http://' + bevy.slug + '.joinbevy.com/invite/' + invite_token.token,
            inviter_email: user.email,
            inviter_name: user.username
          }, function(err, results) {
            if(err) return callback(err);
            return callback(null);
          });
        });
      }, function(err) {
        if(err) return done(err);
        return done(null, user);
      });
    }
  ], function(err, result) {
    if(err) return next(err);
    // success!
    return res.json(result);
  });
};
exports.createBevy = createBevy;

// GET /bevies/:bevyid
exports.getBevy = function(req, res, next) {
  var bevy_id_or_slug = req.params.bevyid;

  Bevy.findOne({ $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]},
    function(err, bevy) {
    if(err) return next(err);
    return res.json(bevy);
  })
  .populate({
    path: 'admins',
    select: userPopFields
  })
  .populate({
    path: 'boards',
    select: boardPopFields
  });
}

// GET /bevies/search/:query
exports.searchBevies = function(req, res, next) {
  var query = req.params.query;
  var promise = Bevy.find()
    .limit(20)
    .or([
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ])
    .exec();
  promise.then(function(bevies) {
    return res.json(bevies);
  }, function(err) {
    return next(err);
  });
}

// PUT/PATCH /bevies/:bevyid
exports.updateBevy = function(req, res, next) {
  var bevy_id_or_slug = req.params.bevyid;

  var update = {};
  if(req.body['name'] != undefined)
    update.name = req.body['name'];
  if(req.body['image'] != undefined)
    update.image = req.body['image'];
  if(req.body['admins'] != undefined)
    update.admins = req.body['admins'];
  if(req.body['boards'] != undefined)
    update.boards = req.body['boards'];
  if(req.body['settings'] != undefined)
    update.settings = req.body['settings'];

  if(req.body['slug'] != undefined)
    update.slug = req.body['slug'];
  else
    update.slug = getSlug(update.name);

  var query = { $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]};
  var promise = Bevy.findOneAndUpdate(query, update, { new: true })
    .populate({
      path: 'admins',
      select: userPopFields
    })
    .populate({
      path: 'boards',
      select: boardPopFields
    })
    .exec();
  promise.then(function(bevy) {
    if(!bevy) return next('Bevy not found');
    return bevy;
  }).then(function(bevy) {
    return res.json(bevy);
  }, function(err) { next(err); });
}

// PUT/PATCH /bevies/:bevyid/boards
exports.addBoard = function(req, res, next) {
  var bevy_id_or_slug = req.params.bevyid;

  if(req.body['board'] != undefined)
    var board = req.body['board'];

  Bevy.findOne({ $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]}, function(err, bevy) {
    if(err) return next(err);
    if(!bevy) return next('bevy not found');
    // push the new board
    bevy.boards.push(board);
    // save to database
    bevy.save(function(err, $bevy) {
      if(err) return next(err);
      return res.json($bevy);
    });
  });
}

// DELETE /bevies/:bevyid
exports.destroyBevy = function(req, res, next) {
  var bevy_id = req.params.bevyid;

  async.waterfall([
    // delete all boards directly related to this bevy
    function(done) {
      Board.remove({ parent: bevy_id }, function(err, boards) {
        if(err) return done(err);
        return done(null, boards);
      });
    },
    // remove all posts posted to those boards
    function(boards, done) {
      Post.remove({ board: { $in: _.pluck(boards, '_id') }}, function(err, posts) {
        if(err) return done(err);
        return done(null, boards);
      });
    },
    // remove board refs from all bevies with those boards in their collection
    function(boards, done) {
      async.each(boards, function(board, callback) {
        Bevy.find({ boards: board._id }, function(err, bevies) {
          if(err) return callback(err);
          async.each(bevies, function(bevy, $callback) {
            bevy.boards.pull(board._id);
            bevy.save(function(err) {
              if(err) return $callback(err);
              return $callback(null);
            });
          }, function(err) {
            if(err) return callback(err);
            return callback(null);
          });
        });
      }, function(err) {
        if(err) return done(err);
        return done(null, boards);
      });
    },
    // remove board refs from all users with those boards in their collection
    function(boards, done) {
      async.each(boards, function(board, callback) {
        User.find({ boards: board._id }, function(err, users) {
          if(err) return callback(err);
          async.each(users, function(user, $callback) {
            user.boards.pull(board._id);
            user.save(function(err) {
              if(err) return $callback(err);
              return $callback(null);
            });
          }, function(err) {
            if(err) return callback(err);
            return callback(null);
          });
        });
      }, function(err) {
        if(err) return done(err);
        return done(null);
      });
    },
    // remove all refs to this bevy from users subbed to it
    function(done) {
      User.find({ bevies: bevy_id }, function(err, users) {
        async.each(users, function(user, callback) {
          user.bevies.pull(bevy_id);
          user.save(function(err) {
            if(err) return callback(err);
            return callback(null);
          });
        }, function(err) {
          if(err) return done(err);
          return done(null);
        });
      });
    },
    // finally, remove the bevy from the database
    function(done) {
      Bevy.findOneAndRemove({ _id: bevy_id }, function(err, bevy) {
        if(err) return next(err);
        if(_.isEmpty(bevy)) return next('Bevy not found');
        done(null, bevy);
      });
    }
  ], function(err, bevy) {
    if(err) return next(err);
    return res.json(bevy);
  });
};

var verifySlug = function(slug) {
  if(_.isEmpty(slug)) return false;

  var allowed_chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-'];

  var i = 0;
  var char = '';
  while(i < slug.length) {

    if(!_.contains(allowed_chars, slug.charAt(i))) {
      // character is not in the allowed list
      return false;
    }
    i++;
  }

  return true;
};
exports.verifySlug = verifySlug;

// GET /bevies/:slug/verify
var checkIfSlugAvailable = function(req, res, next) {
  var slug = req.params.slug;
  if(!verifySlug(slug)) {
    return next('URL in incorrect format. Only lowercase letters and hypens are allowed');
  }
  if(slug.charAt(0) == '-') return next('URL cannot begin with a hyphen');
  if(slug.charAt(slug.length - 1) == '-') return next('URL cannot end with a hyphen');

  Bevy.findOne({ slug: slug }, function(err, bevy) {
    if(err) return next(err);
    if(_.isEmpty(bevy)) return res.json({ found: false }); // no bevy with that slug exists
    else return res.json({ found: true }); // matched a bevy. cant use that slug
  });
};
exports.checkIfSlugAvailable = checkIfSlugAvailable;


// GET /bevies/:bevyid/subscribers
exports.getSubscribers = function(req, res, next) {
  var bevy_id = req.params.bevyid;
  User.find({ bevies: bevy_id }, function(err, users) {
    if(err) return next(err);
    return res.json(users);
  })
  .limit(20);
};
