/**
 * MyBevies.jsx
 *
 * @author kevin
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
var constants = require('./../../constants');
var UserStore = require('./../../profile/UserStore');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var user = window.bootstrap.user;
var constants = require('./../../constants');
var BEVY = constants.BEVY;
var USER = constants.USER;
var NOTIFICATION = constants.NOTIFICATION;
var BevyStore = require('./../../bevy/BevyStore');
var BevyActions = require('./../../bevy/BevyActions');
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
      <div className='new-bevy-card' onClick={() => { this.setState({ showNewBevyModal: true }); }} key={'new panel'}>
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

  render() {
    var content = (
      <div className='panel-list'>
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
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MyBevies;
