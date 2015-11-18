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
  }).limit(15);
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
  var promise;
  if(_.isEmpty(query)) {
    promise = User.find()
      .limit(10)
      .exec();
  } else {
    promise = User.find()
      .limit(10)
      .or([
        { email: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { 'google.displayName': { $regex: query, $options: 'i' } },
      ])
      .exec();
  }
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

// PATCH /users/:userid/addbevy/:bevyid
exports.addBevy = function(req, res, next) {
  var user_id = req.params.userid;
  var bevy_id = req.params.bevyid;

  User.findOne({ _id: user_id }, function(err, user) {
      if(err) return next(err);

      var update = {};
      update.updated = new Date();
      update.bevies = user.bevies;
      update.bevies.push(bevy_id);
      update.bevies = _.uniq(update.bevies);

      var promise = User.findOneAndUpdate({ _id: user_id }, update, { new: true  });
      promise.then(function($user) {
        return res.json($user);
      }, function(err) {
        return next(err);
      });
    }
  );
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
    if(!_.contains(orig_user.linkedAccounts, account_id)) 
      orig_user.linkedAccounts.push(account_id);
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
          if(!_.contains(new_user.linkedAccounts, $id) && $id != account_id) 
            new_user.linkedAccounts.push($id);
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

// GET /users/:username/verify
exports.verifyUsername = function(req, res, next) {
  var username = req.params.username;

  User.findOne({ username: username }, function(err, user) {
    if(err) return next(err);
    if(!user) return res.json({ found: false });
    else return res.json({ found: true });
  });
};

// GET /users/:id/devices
exports.getDevices = function(req, res, next) {
  var user_id = req.params.id;
  User.findOne({ _id: user_id }, function(err, user) {
    if(err) return next(err);
    return res.json(user.devices);
  });
};

// POST /users/:id/devices
exports.addDevice = function(req, res, next) {
  var user_id = req.params.id;
  var token = req.body['token'];
  if(_.isEmpty(token)) return next('No device token supplied');
  var platform = req.body['platform'];
  if(_.isEmpty(platform)) return next('No device platform supplied');

  User.findOne({ _id: user_id }, function(err, user) {
    if(err) return next(err);
    // check for dupe
    if(_.findWhere(user.devices.toObject(), { token: token }) != undefined) {
      return next('Device already added');
    }
    // new device object
    var new_device = {
      token: token,
      platform: platform
    };
    // add additional device information if it exists
    var additional_keys = ('deviceID manufacturer model uniqueID name version '
     + 'bundleID buildNum appVersion appVersionReadable').split(' ');
    for(var i in additional_keys) {
      var key = additional_keys[i];
      if(req.body[key])
        new_device[key] = req.body[key];
    }
    // push the new device
    user.devices.push(new_device);
    // save to database
    user.save(function(err, $user) {
      if(err) return next(err);
      return res.json($user);
    });
  });
};

// PUT /users/:id/devices/:deviceid
// PATCH /users/:id/devices/:deviceid
exports.updateDevice = function(req, res, next) {
  var user_id = req.params.id;
  var device_id = req.params.deviceid;

  User.findOne({ _id: user_id }, function(err, user) {
    if(err) return next(err);
    // get device
    var device = _.findWhere(user.devices.toObject(), { _id: device_id });
    // check if device exists
    if(device == undefined) {
      return next('Device not found')
    }
    // push new device information
    var keys = ('token platform deviceID manufacturer model uniqueID name version '
     + 'bundleID buildNum appVersion appVersionReadable').split(' ');
    for(var i in keys) {
      var key = keys[i];
      if(req.body[key])
        device[key] = req.body[key];
    }
    // remove the old device
    user.devices.pull({ _id: device_id });
    // push the new device
    user.devices.push(device);
    // save to database
    user.save(function(err, $user) {
      if(err) return next(err);
      return res.json($user);
    });
  })
};

// DELETE /users/:id/device/:deviceid
exports.removeDevice = function(req, res, next) {
  var user_id = req.params.id;
  var device_id = req.params.deviceid;

  var device_id = req.body['device_id'];
  if(_.isEmpty(device_id)) return next('No device id supplied');

  User.findOne({ _id: user_id }, function(err, user) {
    if(err) return next(err);
    if(_.findWhere(user.devices.toObject, { _id: device_id }) == undefined) {
      return next('Device not found');
    }
    user.devices.pull({ _id: device_id });
    user.save(function(err, $user) {
      if(err) return next(err);
      return res.json($user);
    });
  });
};
