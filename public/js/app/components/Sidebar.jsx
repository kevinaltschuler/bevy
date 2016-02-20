/**
 * Sidebar.jsx
 *
 * Inner component for the materiak ui left navbar
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var Ink = require('react-ink');

var UserSidebar = require('./../../user/components/UserSidebar.jsx');

var _ = require('underscore');
var constants = require('./../../constants');

var pages = 'home profile directory'.split(' ');

var Sidebar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    leftNavActions: React.PropTypes.object
  },

  getInitialState() {
    return {
      page: 'home'
    };
  },

  componentDidMount() {

  },
  componentWillUnmount() {

  },

  renderPage() {
    switch(this.state.page) {
      case 'home':
        return (
          <UserSidebar
            activeBevy={ this.props.activeBevy }
            leftNavActions={ this.props.leftNavActions }
          />
        );
        break;
      case 'profile':
        break;
      case 'directory':
        break;
    }
  },

  render() {
    if(_.isEmpty(window.bootstrap.user)) return <div />;

    return (
      <div className='sidebar-container'>
        { this.renderPage() }
      </div>
    );
  }
});

module.exports = Sidebar;
