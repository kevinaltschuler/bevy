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
      <span className="footer" style={{alignSelf: 'flex-start', marginBottom: 20}}>
        English (US) · Bevy © { (new Date).getFullYear() }
        <br />
        Version { version } <b>BETA</b>
      </span>
    );
  }
});

module.exports = Footer;
