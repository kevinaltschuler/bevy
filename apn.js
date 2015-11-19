/* apn.js
 * @author kevin
 */

'use strict';

var _ = require('underscore');

var apn = require('apn');
var zmq = require('zmq');
var gcm = require('node-gcm');
var gcm_sender = new gcm.Sender('AIzaSyAwwjrZ_RkwmCFx5Gs8ENKQvVABgZ22W4g');

var options = { };
var apnConnection = new apn.Connection(options);

var subSock = zmq.socket('sub');
subSock.connect('tcp://127.0.0.1:4000');

// subscribe to events
subSock.subscribe('chat_message');

//listener for a new chat message
subSock.on('message', function(event, data) {
  event = event.toString();
  data = JSON.parse(data.toString());
  var message = data.message;
  var to_users = data.to_users;
  var thread = message.thread;
  var author = message.author;

  var android_devices = [];
  
  //for all users in a thread
  for(var i in to_users) {
    var user = to_users[i];
    if(user._id == author) {
      //console.log('dont send to author: ', author);
      return;
    }
    //console.log('sending to all devices for: ', user._id);
    //console.log('the devices: ', user.devices);
    // send a notification to all devices
    for(var j in user.devices) {
      var device = user.devices[j];
      console.log('sending to ', user._id, ' ', device.token);

      if(device.platform == 'ios') {
        var iosDevice = new apn.Device(device.token);
        var note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 3;
        note.sound = "ping.aiff";
        note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
        note.payload = {'messageFrom': author.displayName};

        apnConnection.pushNotification(note, iosDevice);
	console.log('sent!');
      } else if (device.platform == 'android') {
        android_devices.push(device.token);
	console.log('sent to android!');
      }
    }
  }

  // if theres valid android devices to send to
  if(!_.isEmpty(android_devices)) {
    var $message = new gcm.Message({
      collapse_key: 'com.bevyios',
      priority: 'high',
      content_available: true,
      delay_while_idle: false,
      time_to_live: 1 * 60 * 60 * 24, // 1 day
      data: {
        from_user: message.author._id,
        thread_id: message.thread._id,
        event: 'chat_message'
      },
      notification: {
        title: 'New Message',
        icon: 'ic_launcher',
        body: message.author.displayName + ': ' + message.body,
        tag: 'chat_message',
        click_action: 'android.intent.action.MAIN'
      }
    });
    gcm_sender.send($message, { registrationTokens: android_devices }, 
      function(err, result) {
      if(err) console.error(err);
      else console.log(result);
    });
  }
});
