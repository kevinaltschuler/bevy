/**
 * BevyDropdownItem.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var Ink = require('react-ink');

var {
  Button
} = require('react-bootstrap');
var {
  IconButton
} = require('material-ui');

var router = require('./../../router');
var ChatActions = require('./../../chat/ChatActions');

var BevyDropdownItem = React.createClass({

  propTypes: {
    active: React.PropTypes.bool,
    bevy: React.PropTypes.object
  },

  openBevyChat(ev) {
    ev.preventDefault();
    ChatActions.startBevyChat(this.props.bevy._id);
  },

  switchBevy(ev) {
    ev.preventDefault();
    router.navigate('/b/' + this.props.bevy._id, { trigger: true });
  },

  render() {
    var bevy = this.props.bevy;
    var image_url = (_.isEmpty(bevy.image_url)) ? '/img/logo_100.png' : bevy.image_url;

    var chatButton = (this.props.bevy.settings.group_chat)
    ?  <IconButton
          iconClassName='glyphicon glyphicon-comment'
          onClick={ this.openBevyChat }
          style={{width: '35px', height: '35px', padding: '5px', margin: '3px'}}
          iconStyle={{color: '#aaa',fontSize: '14px'}}
        />
    : <div/>

    return (
      <a 
        href={ '/b/' + bevy._id } 
        onClick={ this.switchBevy }
        className={ 'bevy-dropdown-item' + ((this.props.active) ? ' active' : '') }
      >
        <Ink style={{ color: '#aaa', height: 48, top: 'inherit' }}/>
        <div
          className='bevy-image'
          style={{ backgroundImage: 'url(' + image_url + ')' }}
        />
        <div className='bevy-details'>
          <span className='bevy-name'>{ bevy.name }</span>
          <span className='bevy-description'>{ bevy.description }</span>
        </div>
        { chatButton }
      </a>
    );
  }
});

module.exports = BevyDropdownItem;