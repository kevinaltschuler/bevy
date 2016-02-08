/**
 * email.js
 *
 * controller that handles the rendering of emails
 *
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;
var mailgun = require('./../config').mailgun();

// the address that we send emails from
var FROM_EMAIL = 'Bevy Team <contact@joinbevy.com>';

/**
 * uses mailgun to render the email of a given type to the receiver
 *
 * @param recipient {string} - the email address of the recipient
 * @param type {string} - the type of email to send (ex. welcome, invite, etc.)
 * @param locals {object} - template-specific variables for the email. these are also
 * verified here before we try to render the email to prevent crashing.
 * @param done {function} - callback function
 */
var sendEmail = function(recipient, type, locals, done) {
  // we need all of these to continue
  if(_.isEmpty(recipient)) return done('No recipient specified');
  if(_.isEmpty(type)) return done('No template type specified');
  if(_.isEmpty(locals)) return done('No template vars specified');

  switch(type) {
    case 'welcome':
      // check if all locals exist
      if(_.isEmpty(locals.user_email)
        || _.isEmpty(locals.bevy_name)
        || _.isEmpty(locals.pass_link)) {
        return done('Missing required vars for the welcome email template');
      }
      renderWelcomeEmail(locals, function(err, results) {
        if(err) return done(err);
        mailgun.messages().send({
          from: FROM_EMAIL,
          to: recipient,
          subject: 'Welcome To Bevy',
          html: results.html
        }, function(err, body) {
          if(err) return done(err);
          return done(null, body);
        });
      });
      break;
    case 'invite':
      if(_.isEmpty(locals.user_email)
        || _.isEmpty(locals.bevy_name)
        || _.isEmpty(locals.bevy_slug)
        || _.isEmpty(locals.invite_link)
        || _.isEmpty(locals.inviter_email)
        || _.isEmpty(locals.inviter_name)) {
        return done('Missing required vars for the invite email template')
      }
      renderInviteEmail(locals, function(err, results) {
        if(err) return done(err);
        mailgun.messages().send({
          from: FROM_EMAIL,
          to: recipient,
          subject: locals.inviter_name + ' invited you to join ' + locals.bevy_name + ' on Bevy',
          body: results.body,
          html: results.html
        }, function(err, body) {
          if(err) return done(err);
          return done(null, body);
        });
      });
      break;
    case 'reset-password':
      break;
    default:
      // invalid template type
      return done('Invalid template type');
      break;
  }
};

var renderWelcomeEmail = function(locals, done) {
  var templateDir = path.join(__dirname, '..', 'views', 'email', 'welcome-email');
  var template = new EmailTemplate(templateDir);
  template.render({
    user_email: locals.user_email,
    bevy_name: locals.bevy_name,
    pass_link: locals.pass_link
  }, function(err, results) {
    if(err) return done(err);
    return done(null, {
      html: results.html,
      text: results.text
    });
  });
};

var renderInviteEmail = function(locals, done) {
  var templateDir = path.join(__dirname, '..', 'views', 'email', 'invite-email');
  var template = new EmailTemplate(templateDir);
  template.render({
    user_email: locals.user_email,
    bevy_name: locals.bevy_name,
    bevy_slug: locals.bevy_slug,
    invite_link: locals.invite_link,
    inviter_name: locals.inviter_name,
    inviter_email: locals.inviter_email
  }, function(err, results) {
    return done(null, {
      html: results.html,
      text: results.text
    });
  });
};

exports.sendEmail = sendEmail;
exports.renderWelcomeEmail = renderWelcomeEmail;
