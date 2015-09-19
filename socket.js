/**
 * socket.js
 * @author  albert
 */

'use strict';

var zmq = require('zmq');

module.exports = function(server) {
  var io = require('socket.io')(server);

  io.on('connection', function(socket) {
    //console.log(socket, 'connected');

    var subSock = zmq.socket('sub');
    subSock.connect('tcp://127.0.0.1:4000');
    //console.log('new subscriber bound to port 4000');

    subSock.subscribe('kitty cats');
    subSock.on('message', function(event, data) {
      event = event.toString();
      data = data.toString();
      console.log(event, data);
      socket.emit(event, data);
    });

    socket.on('set_user_id', function(user_id) {
      console.log('user_id', user_id);
      subSock.subscribe('chat:' + user_id);
      subSock.subscribe('notification:' + user_id);
    });

    socket.on('disconnect', function() {
      // clean up socket
      subSock.close();
    });
  });

  return io;
};