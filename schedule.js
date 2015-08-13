/**
 * schedule.js
 * run misc tasks
 * @author albert
 */

'use strict';

var schedule = require('node-schedule');
var async = require('async');
var mongoose = require('mongoose');
var Bevy = mongoose.model('Bevy');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

var bevySubCountJob = schedule.scheduleJob('* * * * *', function() {
  var limit = 20; // do 20 bevies at once
  var i = 0;
  //console.log('starting bevy sub count job');
  Bevy.count(function(err, numBevies) {
    //console.log(numBevies, 'bevies found');
    async.whilst(
      function() { return i < numBevies },
      function(callback) {
        Bevy.find(function(err, bevies) {
          async.each(bevies,
            function(bevy, $callback) {
              //console.log('counting subscribers of', bevy._id);
              User.count({ bevies: bevy._id }, function(err, subCount) {
                Bevy.update({ _id: bevy._id }, { subCount: subCount }, function(err, $bevy) {
                  //console.log(bevy._id, 'has', subCount, 'subscribers');
                  $callback();
                });
              });
            },
            function(err) {
              // done going through each bevy
              i += limit;
              callback();
            }
          );
        })
          .sort('-created')
          .limit(limit)
          .skip(i);
      },
      function(err) {
        // done
        //console.log('done counting subscribers');
      }
    );
  });
});

var userPointCountJob = schedule.scheduleJob('* * * * *', function() {
  var limit = 20; // do 20 users at once
  var i = 0;
  //console.log('starting user point count job');
  User.count(function(err, numUsers) {
    //console.log(numUsers, 'users found');
    async.whilst(
      function() { return i < numUsers },
      function(callback) {
        User.find(function(err, users) {
          async.each(users,
            function(user, $callback) {
              //console.log('counting points of', user._id);
              Post.find({ votes: { $elemMatch: { voter: user._id } } }, function(err, posts) {
                // add up the points
                var sum = 0;
                posts.forEach(function(post) {
                  post.votes.forEach(function(vote) {
                    sum += vote.score;
                  });
                });
                User.update({ _id: user._id }, { points: sum }, function(err, $user) {
                  //console.log(user._id, 'has', sum, 'points');
                  $callback();
                });
              });
            },
            function(err) {
              // done going through each user
              i += limit;
              callback();
            }
          );
        })
          .sort('-created')
          .limit(limit)
          .skip(i);
      },
      function(err) {
        // done
        //console.log('done counting user points');
      }
    );
  });
});
