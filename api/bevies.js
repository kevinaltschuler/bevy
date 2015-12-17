/**
 * bevies.js
 *
 * API for bevies
 *
 * @author albert
 */

'use strict';

// imports
var mongoose = require('mongoose');
var error = require('./../error');
var _ = require('underscore');
var shortid = require('shortid');
var async = require('async');
var getSlug = require('speakingurl');

var User = mongoose.model('User');
var Bevy = mongoose.model('Bevy');
var Thread = mongoose.model('ChatThread');
var Message = mongoose.model('ChatMessage');
var Post = mongoose.model('Post');
Bevy.collection.ensureIndex({name: 'text'}, function(err) { return err });

var ChatThread = mongoose.model('ChatThread');

function collectBevyParams(req) {
  var update = {};
  // dynamically load schema values from request object
  Bevy.schema.eachPath(function(pathname, schema_type) {
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
// GET /users/:userid/bevies
exports.index = function(req, res, next) {
  var userid = req.params.userid;
  //console.log(req.user);
  User.findOne({ _id: userid }, function(err, user) {
    if(err) return next(err);
    if(!user) return res.json([]);
    Bevy.find({ _id: { $in: user.bevies } }, function(err, bevies) {
      if(err) return next(err);
      return res.json(bevies);
    })
    .populate({
      path: 'admins',
      select: 'displayName username email image'
    })
    .populate({
      path: 'siblings'
    });
  });
}

//INDEX
//GET /bevies
exports.indexPublic = function(req, res, next) {
  Bevy.find(function(err, bevies) {
    if(err) return next(err);
    return res.json(bevies);
  })
    .populate({
      path: 'admins',
      select: 'displayName username email image'
    })
    .populate({
      path: 'siblings'
    })
    .limit(20);
}

// CREATE
// POST /bevies
exports.create = function(req, res, next) {
  var update = {};
  update._id = shortid.generate();
  if(req.body['name'] == undefined) return next('New Bevy has no name');
  update.name = req.body['name'];
  if(req.body['description'] != undefined)
    update.description = req.body['description'];
  if(req.body['image'] != undefined)
    update.image = req.body['image'];
  if(req.body['admins'] != undefined)
    update.admins = req.body['admins'];
  if(req.body['tags'] != undefined)
    update.tags = req.body['tags'];

  if(!update.name) throw error.gen('bevy name not specified', req);

  if(req.body['slug'] != undefined)
    update.slug = req.body['slug'];
  else
    update.slug = getSlug(update.name);

  Bevy.create(update, function(err, bevy) {
    if(err) return next(err);
    // create chat thread
    ChatThread.create({ bevy: bevy._id }, function(err, thread) {

    });
    return res.json(bevy);
  });
}

// SHOW
// GET /bevies/:id
exports.show = function(req, res, next) {
  var id = req.params.id;

  Bevy.findOne({ _id: id }, function(err, bevy) {
    if(err) return next(err);
    return res.json(bevy);
  }).populate({
    path: 'admins',
    select: 'displayName username email image'
  })
  .populate({
    path: 'siblings'
  });
}

// SEARCH
// GET /bevies/search/:query
exports.search = function(req, res, next) {
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

// UPDATE
// PUT/PATCH /bevies/:id
exports.update = function(req, res, next) {
  var id = req.params.id;

  var update = collectBevyParams(req);
  if(req.body['settings']) {
    update.settings = req.body['settings'];
    if(update.settings.group_chat) {
      // group chat was enabled, create thread
      // use update func so we dont create one if it already exists
      ChatThread.update({ bevy: id }, { bevy: id }, { upsert: true }, function(err, thread) {

      });
    } else {
      // group chat was disabled, destroy thread
      ChatThread.findOneAndRemove({ bevy: id }, function(err, thread) {

      });
    }
  }
  if(req.body['tags']) {
    update.tags = req.body['tags'];
  }
  if(req.body['siblings']) {
    update.siblings = req.body['siblings'];
  }

  var query = { _id: id };
  var promise = Bevy.findOneAndUpdate(query, update, { new: true })
    .populate({
      path: 'admins',
      select: 'displayName username email image'
    })
    .populate({
      path: 'siblings'
    })
    .exec();
  promise.then(function(bevy) {
    if(!bevy) throw error.gen('bevy not found', req);
    return bevy;
  }).then(function(bevy) {
    res.json(bevy);
  }, function(err) { next(err); });
}

// DESTROY
// DELETE /bevies/:id
exports.destroy = function(req, res, next) {
  var id = req.params.id;

  var query = { _id: id };
  var promise = Bevy.findOneAndRemove(query)
    .exec();
  promise.then(function(bevy) {
    // delete the thread for this bevy
    Thread.findOneAndRemove({ bevy: id }, function(err, thread) {
      // and delete all messages in that thread
      Message.remove({ thread: thread._id }, function(err, messages) {});
    });
    // delete all posts posted to this bevy
    Post.remove({ bevy: id }, function(err, posts) {});
    // remove the reference to the bevy in all user's subscribed bevies
    User.find({bevies: id}, function(err, users) {
      async.each(users, function(user, callback) {
        user.bevies.pull(id);
        user.save(function(err) {
          if(err) next(err);
        });
        callback();
      },
      function(err) {
        if(err) return next(err);
      });
    });
    // remove all references to this bevy from other bevies' siblings field
    Bevy.find({ siblings: id }, function(err, bevies) {
      bevies.forEach(function($bevy) {
        $bevy.siblings.pull(id);
        $bevy.save(function(err, $$bevy) {});
      });
    });

    return res.json(bevy);
  }, function(err) { next(err); })
};


// GET /bevies/:slug/verify
exports.verifySlug = function(req, res, next) {
  var slug = req.params.slug;

  Bevy.findOne({ slug: slug }, function(err, bevy) {
    if(err) return next(err);
    if(_.isEmpty(bevy)) return res.json({ found: false }); // no bevy with that slug exists
    else return res.json({ found: true }); // matched a bevy. cant use that slug
  });
};
