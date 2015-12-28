/**
 * schedule.js
 * run misc tasks
 * @author albert
 */

'use strict';

var schedule = require('node-schedule');
var async = require('async');
var mongoose = require('mongoose');

var Bevy = require('./models/Bevy');
var User = require('./models/User');
var Post = require('./models/Post');
var Comment = require('./models/Comment');
var Board = require('./models/Board');

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

var boardSubCountJob = schedule.scheduleJob('* * * * *', function() {
  var limit = 20; // do 20 boards at once
  var i = 0;
  //console.log('starting board sub count job');
  Board.count(function(err, numBoards) {
    //console.log(numBevies, 'boards found');
    async.whilst(
      function() { return i < numBoards },
      function(callback) {
        Board.find(function(err, boards) {
          async.each(boards,
            function(board, $callback) {
              //console.log('counting subscribers of', board._id);
              User.count({ boards: board._id }, function(err, subCount) {
                Board.update({ _id: board._id }, { subCount: subCount }, function(err, $board) {
                  //console.log(board._id, 'has', subCount, 'subscribers');
                  $callback();
                });
              });
            },
            function(err) {
              // done going through each board
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
              /**/
              async.parallel([
                function($$callback) {
                  // count points
                  Post.find({ votes: { $elemMatch: { voter: user._id } } }, function(err, posts) {
                    // add up the points
                    var sum = 0;
                    posts.forEach(function(post) {
                      post.votes.forEach(function(vote) {
                        sum += vote.score;
                      });
                    });
                    $$callback(null, sum);
                  });
                },
                function($$callback) {
                  // count posts
                  Post.count({ author: user._id }, function(err, postCount) {
                    $$callback(null, postCount);
                  });
                },
                function($$callback) {
                  Comment.count({ author: user._id }, function(err, commentCount) {
                    $$callback(null, commentCount);
                  });
                }
              ],
              function(err, results) {
                var pointCount = results[0];
                var postCount = results[1];
                var commentCount = results[2];

                User.update({ _id: user._id }, { points: pointCount, postCount: postCount, commentCount: commentCount }, function(err, $user) {
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
