/**
 * ProfileDropdown.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var {
  Button,
  Overlay
} = require('react-bootstrap');

var {
  FlatButton,
  TextField
} = require('material-ui');

var AddAccountModal = require('./AddAccountModal.jsx');
var LinkedAccountItem = require('./LinkedAccountItem.jsx');
var Uploader = require('./../../shared/components/Uploader.jsx');

var UserActions = require('./../UserActions');
var UserStore = require('./../UserStore');
var constants = require('./../../constants');
var USER = constants.USER;

var user = window.bootstrap.user;


var ProfileDropdown = React.createClass({

  propTypes: {
    show: React.PropTypes.bool,
    onToggle: React.PropTypes.func
  },

  getInitialState() {
    return {
      image_url: (user.image_url) ? user.image_url : constants.defaultProfileImage,
      showAddAccountModal: false,
      linkedAccounts: []
    }
  },

  componentDidMount() {
    this.container = React.findDOMNode(this.refs.Container);
    UserStore.on(USER.CHANGE_ALL, this.handleChangeAll);
  },

  componentWillUnmount() {
    UserStore.off(USER.CHANGE_ALL, this.handleChangeAll);
  },

  componentWillReceiveProps(nextProps) {
    
  },

  handleChangeAll() {
    this.setState({
      linkedAccounts: UserStore.getLinkedAccounts()
    });
  },

  onUploadComplete(file) {
    //console.log(file);
    var filename = file.filename;
    var image_url = constants.apiurl + '/files/' + filename;
    image_url += '?w=100&h=100';
    this.setState({
      image_url: image_url
    });

    UserActions.update(image_url);
  },

  onChange(ev) {
    this.setState({
      name: this.refs.name.getValue(),
    });
  },

  toggle(ev) {
    ev.preventDefault();
    this.props.onToggle();
  },

  _renderLinkedAccounts() {
    if(_.isEmpty(this.state.linkedAccounts)) return <div />;

    var accounts = [];
    for(var key in this.state.linkedAccounts) {
      var account = this.state.linkedAccounts[key];
      accounts.push(
        <LinkedAccountItem
          key={ 'linkedaccount:' + account._id }
          account={ account } 
        />
      );
    }

    return (
      <div className='linked-accounts'>
        { accounts }
      </div>
    );
  },

  renderOverlay() {

    var name = user.displayName;
    var email = (_.isEmpty(user.google.name))
    ? ''
    : (<span className='profile-email'>{ user.email }</span>)

    var dropzoneOptions = {
      maxFiles: 1,
      acceptedFiles: 'image/*',
      clickable: '.dropzone-panel-button',
      dictDefaultMessage: ' ',
    };

    var profileImage;
    if(_.isEmpty(this.state.image_url)) {
      profileImage = defaultProfileImage;
      var profileImageStyle= {
        backgroundImage: 'url(' + profileImage + ')',
        backgroundSize: '75px 75px'
      };
    } else {
      profileImage =  this.state.image_url;
      var profileImageStyle = {
        backgroundImage: 'url(' + profileImage + ')',
      }
    }

    return (
      <div className='profile-dropdown-container'>
        <div className='backdrop' onClick={ this.toggle }></div>
        <div className='arrow' />
        <div className='profile-dropdown'>
          <div className="profile-top">
            <div className="profile-picture overlay">
              <Uploader
                onUploadComplete={ this.onUploadComplete }
                className="profile-image-dropzone"
                style={ profileImageStyle }
                dropzoneOptions={ dropzoneOptions }
              />
            </div>
            <div className="profile-details">
              <span className='profile-name'>{ name }</span>
              { email }
              <span className='profile-points'>{ user.points }&nbsp;Points</span>
            </div>
          </div>
          { this._renderLinkedAccounts() }
          <div className="profile-dropdown-buttons">
            <FlatButton
              label="Add Account"
              onClick={() => this.setState({ showAddAccountModal: true })}
            />
            <FlatButton
              label="Logout"
              linkButton={ true }
              href='/logout' 
            />
          </div>
          <AddAccountModal
            show={ this.state.showAddAccountModal }
            onHide={() => this.setState({ showAddAccountModal: false })}
            linkedAccounts={ this.state.linkedAccounts }
          />
        </div>
      </div>
    );
  },

  render() {

    var profileImage;
    if(_.isEmpty(this.state.image_url)) {
      profileImage = constants.defaultProfileImage;
      var profileImageStyle= {
        backgroundImage: 'url(' + profileImage + ')',
        backgroundSize: '75px 75px'
      };
    } else {
      profileImage =  this.state.image_url;
      var profileImageStyle = {
        backgroundImage: 'url(' + profileImage + ')',
      }
    }

    var buttonStyle = {
      backgroundImage: 'url(' + profileImage + ')'
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
        <Overlay
          show={ this.props.show }
          target={ (props) => React.findDOMNode(this.refs.ProfileButton) }
          placement='bottom'
          container={ this.container }
        >
          { this.renderOverlay() }
        </Overlay>
      </div>
    );
  }
});
module.exports = ProfileDropdown;
