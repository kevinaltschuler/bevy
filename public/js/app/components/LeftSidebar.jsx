'use strict';

var React = require('react');

var SubBevyPanel = require('./../../bevy/components/SubBevyPanel.jsx');

var LeftSidebar = React.createClass({

  propTypes: {
    myBevies: React.PropTypes.array.isRequired,
    activeBevy: React.PropTypes.object.isRequired,
    activeThread: React.PropTypes.object,
    allBevies: React.PropTypes.array
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
              activeTags={ this.props.activeTags }
              allBevies={ this.props.allBevies }
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LeftSidebar;
