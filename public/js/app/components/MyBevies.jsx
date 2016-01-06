/**
 * MyBevies.jsx
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');
var {
  Button
} = require('react-bootstrap');
var {
  RaisedButton,
  FontIcon,
  CircularProgress
} = require('material-ui');
var BevyPanel = require('./../../bevy/components/BevyPanel.jsx');
var CreateNewBevyModal = require('./../../bevy/components/CreateNewBevyModal.jsx');
var FilterSidebar = require('./FilterSidebar.jsx');
var Footer = require('./Footer.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var user = window.bootstrap.user;
var BEVY = constants.BEVY;
var USER = constants.USER;
var NOTIFICATION = constants.NOTIFICATION;
var BevyStore = require('./../../bevy/BevyStore');
var BevyActions = require('./../../bevy/BevyActions');
var UserStore = require('./../../user/UserStore');
var Ink = require('react-ink');

var MyBevies = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array
  },

  getInitialState() {
    return {
      showNewBevyModal: false,
    };
  },

  componentDidMount() {
    BevyActions.loadMyBevies();
    BevyStore.on(NOTIFICATION.CHANGE_ALL, BevyActions.loadMyBevies);
  },

  componentWillUnmount() {
    BevyStore.off(NOTIFICATION.CHANGE_ALL, BevyActions.loadMyBevies);
  },

  _renderMyBevies() {
    var bevyPanels = [];
    for(var key in this.props.myBevies) {
      var bevy = this.props.myBevies[key];
      bevyPanels.push(
        <BevyPanel
          bevy={ bevy }
          myBevies={ this.props.myBevies }
          key={ 'MyBevyPanel:' + bevy._id }
        />
      );
    };
    return bevyPanels;
  },

  _renderNewBevyButton() {
    return (
      <div
        className='new-bevy-card'
        title='Create New Bevy'
        onClick={() => { this.setState({ showNewBevyModal: true }); }}
        key='new panel'
      >
        <div className='plus-icon'>
          <FontIcon
            className='material-icons'
            style={{color: 'rgba(0,0,0,.2)', fontSize: '40px'}}
          >
            add
          </FontIcon>
        </div>
        <div className='new-bevy-text'>
          Create a New Bevy
        </div>
        <Ink style={{width: 275, height: 195, top: -3, left: -3}}/>
      </div>
    );
  },

  _renderDiscoverButton() {
    if(!_.isEmpty(this.props.myBevies)) return <div />;
    return (
      <div
        className='new-bevy-card'
        title='Find New Bevies'
        onClick={() => { window.location.href = constants.siteurl + '/s/' }}
        key='discover panel'
      >
        <div className='plus-icon'>
          <FontIcon
            className='material-icons'
            style={{color: 'rgba(0,0,0,.2)', fontSize: '40px'}}
          >
            explore
          </FontIcon>
        </div>
        <div className='new-bevy-text'>
          Find New Bevies
        </div>
        <Ink style={{width: 275, height: 195, top: -3, left: -3}}/>
      </div>
    );
  },

  render() {
    var content = (
      <div className='panel-list'>
        { this._renderDiscoverButton() }
        { this._renderMyBevies() }
        { this._renderNewBevyButton() }
      </div>
    );

    return (
      <div className='my-bevy-wrapper'>
        <CreateNewBevyModal
          show={ this.state.showNewBevyModal }
          onHide={() => { this.setState({ showNewBevyModal: false }) }}
        />
        <div className='mid-section'>
          <div className='my-bevy-list'>
            { content }
            <Footer />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MyBevies;
