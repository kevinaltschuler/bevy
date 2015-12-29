/**
 * notifications/invite.js
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var async = require('async');


exports.createInvite = function(req, res, next) {
  /*var bevy_id = req.body['bevy_id'];
  var bevy_name = req.body['bevy_name'];
  var bevy_img = req.body['bevy_img'];
  var inviter_name = req.body['inviter_name'];
  var emails = req.body['emails'];

  var template = require('./../public/html/email/template.jsx')(bevy_name, inviter_name, bevy_id);

  var notifications = [];

  async.waterfall([
    function(done) {
      emails.forEach(function(email) {
        // push the notification object onto a matching user
        User.findOne({ email: email }, function(err, user) {
          if(err) return next(err);
          if(!user) {
            notifications.push({
              email: email,
              event: 'invite:email',
              data: {
                bevy_id: bevy_id,
                bevy_name: bevy_name,
                bevy_img: bevy_img,
                inviter_name: inviter_name,
                _id: shortid.generate
              }
            });
          } else {
            notifications.push({
              user: user._id,
              event: 'invite:email',
              data: {
                bevy_id: bevy_id,
                bevy_name: bevy_name,
                bevy_img: bevy_img,
                inviter_name: inviter_name,
                _id: shortid.generate
              }
            });
          }

          if(notifications.length == members.length) done(null); // continue when ready
        });

        // then send the invite email
        mailgun.messages().send({
          from: 'Bevy Team <contact@joinbevy.com>',
          to: email,
          subject: 'Invite',
          html: template
        }, function(err, body) {
          if(err) return next(err);
        });
      });
    },
    function(err, done) {
      pushNotifications(notifications);
    }
  ]);*/
};
