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
var MyBevyPanel = require('./../../bevy/components/MyBevyPanel.jsx');
var CreateNewBevyModal = require('./../../bevy/components/CreateNewBevyModal.jsx');
var FilterSidebar = require('./FilterSidebar.jsx');
var Footer = require('./Footer.jsx');
var constants = require('./../../constants');
var UserStore = require('./../../profile/UserStore');

var _ = require('underscore');
var CTG = React.addons.CSSTransitionGroup;
var constants = require('./../../constants');
var router = require('./../../router');
var user = window.bootstrap.user;
var constants = require('./../../constants');
var BEVY = constants.BEVY;
var USER = constants.USER;
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
    UserStore.on(USER.LOADED, this.loadMyBevies);
  },

  loadMyBevies() {
    console.log('user loaded was called');
    setTimeout(function() {
      BevyActions.loadMyBevies();
    }, 1);
  },

  render() {
    var myBevies = this.props.myBevies;

    console.log(myBevies);

    var bevies = myBevies;

    var myBevyPanels = [];

    for(var key in bevies) {
      var bevy = bevies[key];
      myBevyPanels.push(
        <MyBevyPanel bevy={ bevy } key={ 'MyBevyPanel:' + key } />
      );
    };

    myBevyPanels.push(
      <div className='new-bevy-card' onClick={() => { this.setState({ showNewBevyModal: true }); }}>
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

    var content = (
      <div className='panel-list'>
        { myBevyPanels }
      </div>
    );

    return (
      <div className='my-bevy-wrapper'>
        <CreateNewBevyModal 
          show={ this.state.showNewBevyModal } 
          onHide={() => { this.setState({ showNewBevyModal: false }) }}
        />
        <div className='mid-section'>
          {/*<div className='left-filter-sidebar'>
            <div className='filter-fixed'>
              <FilterSidebar searchQuery={ this.state.searchQuery } />
              <Footer />
            </div>
          </div>*/}
          <div className='my-bevy-list'>
            { content }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MyBevies;
