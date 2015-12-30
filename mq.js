/**
 * mq.js
 * @author  albert
 */

'use strict';

var zmq = require('zmq');

var pubSock = zmq.socket('pub');
pubSock.bindSync('tcp://127.0.0.1:4000');
console.log('publisher bound to port 4000');

setInterval(function(){
  pubSock.send(['kitty cats', 'meow!']);
}, 3000);

exports.pubSock = pubSock;
