/**
 * resizeImage.js
 * @author albert
 * @flow
 */

var _ = require('underscore');
var constants = require('./../../constants');

module.exports = function(image, w_limit, h_limit) {
  if(image.foreign || _.isEmpty(image.geometry)) {
    return {
      width: null,
      height: null,
      url: image.path
    };
  }

  var i_width = image.geometry.width;
  var i_height = image.geometry.height;
  var width, height, ratio;

  if(i_width >= i_height) {
    // horizontal or square image
    ratio = w_limit / i_width;
    width = w_limit;
    height = i_height * ratio;
  } else {
    // vertical image
    ratio = h_limit / i_height;
    height = h_limit;
    width = i_width * ratio;
  }
  //console.log('adjusted dimensions', width, height);
  /*return {
    width: width,
    height: height
  };*/
  return {
    width: width,
    height: height,
    url: image.path + '?w=' + width + '&h=' + height
  };
};
