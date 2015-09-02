/**
 * users.js
 * API for users
 * @author albert
 */

'use strict';

var _ = require('underscore');
var error = require('./../error');
var bcrypt = require('bcryptjs');
var async = require('async');

var shortid = require('shortid')
var mailgun = require('./../config').mailgun();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = mongoose.model('User');
var Bevy = mongoose.model('Bevy');
var Post = mongoose.model('Post');
var Notification = mongoose.model('Notification');

User.ensureIndexes(function(err) {
  if(err) return err;
});

function collectUserParams(req) {
  var update = {};
  User.schema.eachPath(function(pathname, schema_type) {
    // collect path value
    var val = null;
    if(req.body != undefined) val = req.body[pathname];
    if(!val && !_.isEmpty(req.query)) val = req.query[pathname];
    if(!val) return;
    update[pathname] = val;
  });
  return update;
}

// INDEX
// GET /users
exports.index = function(req, res, next) {
  User.find(function(err, users) {
    if(err) return next(err);
    return res.json(users);
  });
}

// CREATE
// POST /users
exports.create = function(req, res, next) {
  //TODO: check for dupes
  //TODO: verify email
  var update = {
    _id: shortid.generate(),
    username: req.body['username'],
    password: req.body['password']
  }
  if(req.body['email'] != undefined)
    update.email = req.body['email'];

  // check for required fields
  if(_.isEmpty(update.username))
    return next(error.gen('Missing Identifier - Username', req));
  else if(_.isEmpty(update.password))
    return next(error.gen('Missing Verification - Password', req));

  // hash password if it exists
  if(update.password) update.password = bcrypt.hashSync(update.password, 8);

  // set default bevies
  var defaultBevies = '11sports 22gaming 3333pics 44videos 555music 6666news 777books'.split(' ');
  update.bevies = defaultBevies;

  User.create(update, function(err, user) {
    if(err) return next(err);

    // send a welcome email
    if(!_.isEmpty(user.email)) {
      mailgun.messages().send({
          from: 'Bevy Team <contact@joinbevy.com>'
        , to: user.email
        , subject: 'Welcome to Bevy!'
        , text: 'Thanks for signing up for bevy! A prettier template is coming soon.'
      });
    }

    // push existing notifications
    //Notification.update({ email: user.email }, { user: user._id }, { multi: true }, function(err, raw) {
    //});

    return res.json(user);
  });
}

// SHOW
// GET /users/:id/
exports.show = function(req, res, next) {
  var id = req.params.id;
  var query = { _id: id };
  var promise = User.findOne(query)
    .exec();
  promise.then(function(user) {
    if(!user) throw error.gen('user not found', req);
    return user;
  }).then(function(user) {
    res.json(user);
  }, function(err) { next(err); });
}

//SEARCH
//GET /users/search/:query
exports.search = function(req, res, next) {
	var query = req.params.query;
  var promise = User.find()
    .limit(10)
    .or([
      { email: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } },
      { 'google.displayName': { $regex: query, $options: 'i' } },
    ])
    .exec();
  promise.then(function(users) {
    return res.json(users);
  }, function(err) { return next(err); });
}

// UPDATE
// PUT/PATCH /users/:id
exports.update = function(req, res, next) {
  var id = req.params.id;

  var update = {};
  update.updated = new Date();
  if(req.body['bevies'] != undefined)
    update.bevies = req.body['bevies'];
  if(req.body['image_url'] != undefined)
    update.image_url = req.body['image_url'];
  if(req.body['linkedAccounts'] != undefined)
    update.linkedAccounts = req.body['linkedAccounts'];

  var promise = User.findOneAndUpdate({ _id: id }, update, { new: true });
  promise.then(function(user) {
    return res.json(user);
  }, function(err) {
    return next(err);
  });
}

// DESTROY
// DELETE /users/:id
exports.destroy = function(req, res, next) {
  var id = req.params.id;

  var query = { _id: id };
  var promise = User.findOneAndRemove(query)
    .exec();
  promise.then(function(user) {
    if(!user) throw error.gen('user not found', req);
    return user;
  }).then(function(user) {
    res.json(user);
  }, function(err) { next(err); });
}

// GET /users/google/:id
exports.getGoogle = function(req, res, next) {
  var id = req.params.id;
  
  User.findOne({ 'google.id': id }, function(err, user) {
    if(err) return next(err);
    return res.json(user);
  });
};

// GET /users/:id/linkedaccounts
exports.getLinkedAccounts = function(req, res, next) {
  var id = req.params.id;

  User.findOne({ _id: id }, function(err, user) {
    if(err) return next(err);
    if(!user) return res.json([]);
    return res.json(user.linkedAccounts);
  }).populate('linkedAccounts');
};

// POST /users/:id/linkedaccounts
exports.addLinkedAccount = function(req, res, next) {
  var id = req.params.id;
  var account_id = req.body['account_id'];

  // update the user
  User.findOne({ _id: id }, function(err, orig_user) {
    if(err) return next(err);
    // push the new user onto the linked accounts of the original one
    if(!_.contains(orig_user.linkedAccounts, account_id)) orig_user.linkedAccounts.push(account_id);
    orig_user.save(function(err, $orig_user) {
      if(err) return next(err);

      // also update the other account to create a two way link
      User.findOne({ _id: account_id }, function(err, new_user) {
        if(err) return next(err);
        var linkedAccounts = orig_user.linkedAccounts.toObject();
        if(!_.contains(new_user.linkedAccounts, id)) new_user.linkedAccounts.push(id);
        for(var key in linkedAccounts) {
          // push the other linked accounts of the original user
          var $id = linkedAccounts[key];
          if(!_.contains(new_user.linkedAccounts, $id) && $id != account_id) new_user.linkedAccounts.push($id);
        }
        new_user.save(function(err, $new_user) {
          if(err) return next(err);
          return res.json($orig_user);
        });
      });

    });
  });
};

// DELETE /users/:id/linkedaccounts/:accountid
exports.removeLinkedAccount = function(req, res, next) {
  var id = req.params.id;
  var account_id = req.params.accountid;

  // update the user
  User.findOne({ _id: id }, function(err, orig_user) {
    if(err) return next(err);
    if(_.contains(orig_user.linkedAccounts, account_id)) orig_user.linkedAccounts.pull(account_id);
    orig_user.save(function(err, $orig_user) {
      if(err) return next(err);
      
      // also update the other account to remove the two way link
      User.findOne({ _id: account_id }, function(err, new_user) {
        if(err) return next(err);
        var linkedAccounts = orig_user.linkedAccounts.toObject();
        if(_.contains(new_user.linkedAccounts, id)) new_user.linkedAccounts.pull(id);
        for(var key in linkedAccounts) {
          // pull the other linked accounts of the original user
          var $id = linkedAccounts[key];
          if(_.contains(new_user.linkedAccounts, $id)) new_user.linkedAccounts.pull($id);
        }
        new_user.save(function(err, $new_user) {
          if(err) return next(err);
          return res.json($orig_user);
        });
      });

    });
  });
};