/**
 * Footer.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var constants = require('./../../constants');
var version = constants.version;

var Footer = React.createClass({
  render() {
    return (
      <span className="footer">
        English (US) · Bevy © 2015
        <br />
        Version { version } <b>BETA</b>
      </span>
    );
  }
});

module.exports = Footer;
