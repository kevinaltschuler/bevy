'use strict';

var React = require('react');

var SubBevyPanel = require('./../../bevy/components/SubBevyPanel.jsx');

var LeftSidebar = React.createClass({

  propTypes: {
    myBevies: React.PropTypes.array.isRequired,
    activeBevy: React.PropTypes.object.isRequired,
    allThreads: React.PropTypes.array.isRequired,
    activeThread: React.PropTypes.object,
  },

  getInitialState() {
    return {
    };
  },

  render() {
    return (
      <div className='left-sidebar'>
        <div className='fixed'>
          <div className='hide-scroll'>
            <SubBevyPanel
              myBevies={ this.props.myBevies }
              activeBevy={ this.props.activeBevy }
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LeftSidebar;
