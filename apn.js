/**
 * apn.js
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var config = require('./config');

var User = require('./models/User');

var apn = require('apn');
var zmq = require('zmq');
var gcm = require('node-gcm');
var gcm_sender = new gcm.Sender('AIzaSyAwwjrZ_RkwmCFx5Gs8ENKQvVABgZ22W4g');

var apnConnection = new apn.Connection({
	cert: config.apn.ios.prodCert,
	key: config.apn.ios.prodKey,
	production: config.apn.ios.production
});

var subSock = zmq.socket('sub');
subSock.connect('tcp://127.0.0.1:4000');

// subscribe to events
subSock.subscribe('chat_message');
subSock.subscribe('notification');

//listener for a new chat message
subSock.on('message', function(event, data) {
  event = event.toString();
  data = JSON.parse(data.toString());

	if(event == 'chat_message') {
		sendChatNotifications(data);
	} else if (event.substring(0, 12) == 'notification') {
		switch(data.event) {
			case 'post:create':
				sendNewPostNotifications(data);
				break;
			case 'comment:reply':
			case 'post:reply':
				sendCommentNotifications(data);
				break;
			default:
				break;
		}
	}

});

var sendChatNotifications = function(data) {
  var message = data.message;
  var to_users = data.to_users;
  var thread = message.thread;
  var author = message.author;

  var android_devices = [];

  //for all users in a thread
  for(var i in to_users) {
    var user = to_users[i];
    if(user._id == author._id) return;
    // send a notification to all devices
    for(var j in user.devices) {
      var device = user.devices[j];
      if(thread.name != undefined) {
        var body = message.author.displayName + ' to ' + thread.name + ": " + message.body;
      } else {
        var body = message.author.displayName + ": " + message.body;
      }

      if(device.platform == 'ios') {
        var iosDevice = new apn.Device(device.token);
        var note = new apn.Notification();

        note.expiry = config.apn.ios.expires_in;
        note.badge = config.apn.ios.badge;
        note.sound = config.apn.ios.sound;
        note.alert = body;
        note.payload = {'messageFrom': author.displayName, 'thread': thread};
        apnConnection.pushNotification(note, iosDevice);
      } else if (device.platform == 'android') {
        android_devices.push(device.token);
      }
    }
  }

  // if theres valid android devices to send to
  if(!_.isEmpty(android_devices)) {
    var $message = new gcm.Message({
      collapse_key: config.apn.android.collapse_key,
      priority: 'high',
      content_available: true,
      delay_while_idle: false,
      time_to_live: config.apn.android.time_to_live,
      data: {
        from_user: message.author._id,
        thread_id: message.thread._id,
        event: 'chat_message'
      },
      notification: {
        title: 'New Message',
        icon: config.apn.android.icon,
        body: body,
        tag: 'chat_message',
        click_action: config.apn.android.click_action
      }
    });
    gcm_sender.send($message, { registrationTokens: android_devices },
      function(err, result) {
      if(err) console.error(err);
      else console.log(result);
    });
  }
};

var sendNewPostNotifications = function(data) {
	var user_id = data.user;
	var payload = data.data;
	payload.event = config.mq.events.NEW_POST;

	var author_name = payload.author_name;
	var board_name = payload.board_name;

	var body = author_name + ' posted to ' + board_name;

	// get user devices
	User.findOne({ _id: user_id }, function(err, user) {
		if(err) {
			console.error(err);
			return;
		}
		if(_.isEmpty(user)) {
			console.error('Notification user not found');
			return;
		}
		for(var i in user.devices) {
			var device = user.devices[i];
			if(device.platform == 'ios') {
				var iosDevice = new apn.Device(device.token);
				var note = new apn.Notification();
				note.expiry = config.apn.ios.expires_in;
				note.badge = config.apn.ios.badge;
				note.sound = config.apn.ios.sound;
				note.alert = body;
				note.payload = payload;
				apnConnection.pushNotification(note, iosDevice);
			} else if (device.platform == 'android') {
				var message = new gcm.Message({
					collapse_key: config.apn.android.collapse_key,
					priority: 'high',
					content_available: true,
					delay_while_idle: false,
					time_to_live: config.apn.android.time_to_live,
					data: payload,
					notification: {
						title: 'New Post',
						icon: config.apn.android.icon,
						body: body,
						tag: config.mq.events.NEW_POST,
						click_action: config.apn.android.click_action
					}
				});
				gcm_sender.send(message, { registrationTokens: [device.token] },
					function(err, result) {
					if(err) console.error(err);
					else console.log(result);
				});
			}
		}
	})
	.select('devices');
};

var sendCommentNotifications = function(data) {
	var user_id = data.user;
	var payload = data.data;
	payload.event = config.mq.events.NEW_COMMENT;

	var author_name = payload.author_name;
	var board_name = payload.board_name;
	var post_title = payload.post_title;
	var comment_body = payload.comment_body;

	var body;
	if(data.event == 'post:reply') {
		body = author_name + ' replied to your post ' + post_title + ' in ' + board_name;
	} else if (data.event == 'comment:reply') {
		body = author_name + ' replied to your comment ' + comment_body + ' in ' + board_name;
	}

	// get user devices
	User.findOne({ _id: user_id }, function(err, user) {
		if(err) {
			console.error(err);
			return;
		}
		if(_.isEmpty(user)) {
			console.error('Notification user not found');
			return;
		}
		for(var i in user.devices) {
			var device = user.devices[i];
			if(device.platform == 'ios') {
				var iosDevice = new apn.Device(device.token);
				var note = new apn.Notification();
				note.expiry = config.apn.ios.expires_in;
				note.badge = config.apn.ios.badge;
				note.sound = config.apn.ios.sound;
				note.alert = body;
				note.payload = payload;
				apnConnection.pushNotification(note, iosDevice);
			} else if (device.platform == 'android') {
				var message = new gcm.Message({
					collapse_key: config.apn.android.collapse_key,
					priority: 'high',
					content_available: true,
					delay_while_idle: false,
					time_to_live: config.apn.android.time_to_live,
					data: payload,
					notification: {
						title: 'New Comment',
						icon: config.apn.android.icon,
						body: body,
						tag: config.mq.events.NEW_COMMENT,
						click_action: config.apn.android.click_action
					}
				});
				gcm_sender.send(message, { registrationTokens: [device.token] },
					function(err, result) {
					if(err) console.error(err);
					else console.log(result);
				});
			}
		}
	})
	.select('devices');
};
