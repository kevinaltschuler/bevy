/**
 * timeago.js
 *
 * @author albert
 */

'use strict';

module.exports = function(expires) {
  var now = Date.now();
  var elapsed = expires - now;

  if(elapsed <= 1000*10) {
    return 'very soon';

  } else if (elapsed <= 1000*60) {
    var seconds = Math.floor(elapsed / 1000);
    //return (seconds > 1) ? seconds + ' seconds ago' : seconds + ' second ago';
    return 'in a few seconds';

  } else if (elapsed <= 1000*60*60) {
    var minutes = Math.floor(elapsed / (1000*60));
    return (minutes > 1) ? 'in ' + minutes + ' minutes' : 'in ' + minutes + ' minute';

  } else if (elapsed <= 1000*60*60*24) {
    var hours = Math.floor(elapsed / (1000*60*60));
    return (hours > 1) ? 'in ' + hours + ' hours' : 'in ' + hours + ' hour';

  } else if (elapsed <= 1000*60*60*24*30) {
    var days = Math.floor(elapsed / (1000*60*60*24));
    return (days > 1) ? 'in ' + days + ' days' : 'in ' + days + ' day';

  } else if (elapsed <= 1000*60*60*24*365) {
    var months = Math.floor(elapsed / (1000*60*60*24*30));
    return (months > 1) ? 'in ' + months + ' months' : 'in ' + months + ' month';

  } else if (elapsed > 1000*60*60*24*365) {
    var years = Math.floor(elapsed / (1000*60*60*24*365));
    return (years > 1) ? 'in ' + years + ' years' : 'in ' + years + ' year';

  } else {
    return elapsed;
  }
}
