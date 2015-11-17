/* apn.js
 * @author kevin
 */

 'use strict';

var apn = require('apn');
var zmq = require('zmq');

module.exports = function() {

	var options = { };

	var apnConnection = new apn.Connection(options);

	var device = new apn.Device(token);


	var subSock = zmq.socket('sub');
	subSock.connect('tcp://127.0.0.1:4000');
	//console.log('new subscriber bound to port 4000')
	
	//listener for a new chat message
	subSock.on('message', function(event, data) {
	    event = event.toJSON();
	    data = data.toJSON(); //the message
	    console.log('message!');
	    var thread = data.thread;
	    var author = data.author;

	    //for all users in a thread
		for(var key in thread.users) {

			var user = thread.users[key];
			// if theyre the author, then dont send a notification
			if(user == author._id)  {
				return;
			}

			else {
				// send a notification to all devices
				for(var key in user.devices) {
					var device = user.devices[key];
					// only send to ios for now
					if(device.platform == 'ios') {
						console.log('sending to ', user.displayName, ' ', device.id);
						var iosDevice = new apn.Device(device.id);
						var note = new apn.Notification();

						note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
						note.badge = 3;
						note.sound = "ping.aiff";
						note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
						note.payload = {'messageFrom': author.displayName};

						apnConnection.pushNotification(note, myDevice);
					}
				}
			}
		}
	});

};