/**
 * timeago.js
 *
 * @author albert
 */

'use strict';

module.exports = function(created) {
  var now = Date.now();
  var elapsed = now - created;

  if(elapsed <= 1000*10) {
    return 'just now';

  } else if (elapsed <= 1000*60) {
    var seconds = Math.floor(elapsed / 1000);
    //return (seconds > 1) ? seconds + ' seconds ago' : seconds + ' second ago';
    return 'a few seconds ago';

  } else if (elapsed <= 1000*60*60) {
    var minutes = Math.floor(elapsed / (1000*60));
    return (minutes > 1) ? minutes + ' minutes ago' : minutes + ' minute ago';

  } else if (elapsed <= 1000*60*60*24) {
    var hours = Math.floor(elapsed / (1000*60*60));
    return (hours > 1) ? hours + ' hours ago' : hours + ' hour ago';

  } else if (elapsed <= 1000*60*60*24*30) {
    var days = Math.floor(elapsed / (1000*60*60*24));
    return (days > 1) ? days + ' days ago' : days + ' day ago';

  } else if (elapsed <= 1000*60*60*24*365) {
    var months = Math.floor(elapsed / (1000*60*60*24*30));
    return (months > 1) ? months + ' months ago' : months + ' month ago';

  } else if (elapsed > 1000*60*60*24*365) {
    var years = Math.floor(elapsed / (1000*60*60*24*365));
    return (years > 1) ? years + ' years ago' : years + ' year ago';

  } else {
    return elapsed;
  }
}
