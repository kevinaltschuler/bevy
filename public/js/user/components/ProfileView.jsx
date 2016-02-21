/**
 * ProfileView.jsx
 *
 * sidebar view for viewing someone's profile
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var Ink = require('react-ink')

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var resizeImage = require('./../../shared/helpers/resizeImage');
var timeAgo = require('./../../shared/helpers/timeAgo');

var ProfileView = React.createClass({
  propTypes: {
    leftNavActions: React.PropTypes.object,
    sidebarActions: React.PropTypes.object,
    profileUser: React.PropTypes.object
  },

  getInitialState() {
    return {

    };
  },

  goBack(ev) {
    ev.preventDefault();
    this.props.sidebarActions.switchPage('directory');
  },

  close() {
    this.props.leftNavActions.close();
  },

  renderDetails() {
    let detailItems = [];
    let details = {};
    details['Username'] = this.props.profileUser.username;
    details['Email'] = this.props.profileUser.email;
    if(!_.isEmpty(this.props.profileUser.phoneNumber))
      details['Phone Number'] = this.props.profileUser.phoneNumber;
    details['Points'] = this.props.profileUser.points;
    details['Posts'] = this.props.profileUser.postCount;
    details['Comments'] = this.props.profileUser.commentCount;
    details['Joined'] = timeAgo(Date.parse(this.props.profileUser.created));

    let detailKeys = Object.keys(details);
    for(var i = 0; i < detailKeys.length; i++) {
      let key = detailKeys[i];
      let value = details[key];

      detailItems.push(
        <div
          key={ 'detail-item:' + i }
          className='detail-item'
        >
          <span className='detail-key'>{ key }</span>
          <span className='detail-value'>{ value }</span>
        </div>
      );
    }
    return (
      <div className='details'>
        { detailItems }
      </div>
    )
  },

  render() {
    return (
      <div className='profile-view'>
        <div className='top-bar'>
          <a
            className='back-button'
            href='#'
            onClick={ this.goBack }
            title='Back to Group Directory'
          >
            <i className='material-icons'>chevron_left</i>
            <span className='title'>Group Directory</span>
          </a>
          <button
            className='close-button'
            title='Close Profile'
            onClick={ this.close }
          >
            <Ink />
            <i className='material-icons'>close</i>
          </button>
        </div>
        <div
          className='profile-picture'
          style={{
            backgroundImage: 'url(' + resizeImage(this.props.profileUser.image, 800, 800).url + ')'
          }}
        />
        <span className='name'>
          { (_.isEmpty(this.props.profileUser.fullName))
              ? this.props.profileUser.username
              : this.props.profileUser.fullName }
        </span>
        <span className='title'>
          { this.props.profileUser.title }
        </span>
        <div className='action-buttons'>
        </div>
        { this.renderDetails() }
      </div>
    );
  }
});

module.exports = ProfileView;
