/**
 * UserDropdown.jsx
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var {
  Button,
  Overlay,
  OverlayTrigger,
  Tooltip
} = require('react-bootstrap');
var {
  FlatButton,
  TextField
} = require('material-ui');
var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var UserActions = require('./../UserActions');
var UserStore = require('./../UserStore');
var constants = require('./../../constants');
var resizeImage = require('./../../shared/helpers/resizeImage');
var USER = constants.USER;
var user = window.bootstrap.user;

var UserDropdown = React.createClass({
  propTypes: {
    show: React.PropTypes.bool,
    onToggle: React.PropTypes.func,
    activeBevy: React.PropTypes.object,
    leftNavActions: React.PropTypes.object
  },

  getInitialState() {
    return {
      image: user.image
    };
  },

  componentDidMount() {
    this.container = ReactDOM.findDOMNode(this.refs.Container);
    UserStore.on(USER.CHANGE_ALL, this.handleChangeAll);
  },
  componentWillUnmount() {
    UserStore.off(USER.CHANGE_ALL, this.handleChangeAll);
  },

  handleChangeAll() {
  },

  toggle(ev) {
    ev.preventDefault();
    this.props.leftNavActions.toggle();
  },

  render() {
    var profileImageURL = (_.isEmpty(this.state.image))
      ? constants.defaultProfileImage
      : this.state.image.path;
    var profileImageStyle = {
      backgroundImage: 'url(' + profileImageURL + ')',
    }

    var buttonStyle = {
      backgroundImage: 'url(' + profileImageURL + ')',
      marginRight: 0
    };

    return (
      <div ref='Container' style={{ position: 'relative' }}>
        <Button
          ref='ProfileButton'
          className='profile-btn'
          onClick={ this.toggle }
          style={ buttonStyle }
          title='Profile'
        />
      </div>
    );
  }
});

module.exports = UserDropdown;
