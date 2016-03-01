/**
 * FourOhFour.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');

var _ = require('underscore');
var router = require('./../../router');
var constants = require('./../../constants');

var FourOhFour = React.createClass({
  render() {
    return (
      <div className='fourohfour'>
        <div className='jenk-navbar'>
          <a href='/' title='Home' className='home-button'>
            <img src='/img/logo_300_white.png' className='home-button-img' />
          </a>
          {/*<span className='title'>
            Bevy
          </span>*/}
        </div>
        <h1>😔😔😔 404: Not Found 😔😔😔</h1>
        {/*<h2>{ window.location.href }</h2>*/}
        <a href='/' title='Home' className='home-link'>
          Go Back Home
        </a>
      </div>
    );
  }
});

module.exports = FourOhFour;
