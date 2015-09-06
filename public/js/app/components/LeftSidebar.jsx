'use strict';

var React = require('react');

var TagPanel = require('./../../bevy/components/TagPanel.jsx');
var SiblingPanel = require('./../../bevy/components/SiblingPanel.jsx');

var LeftSidebar = React.createClass({

  propTypes: {
    myBevies: React.PropTypes.array.isRequired,
    activeBevy: React.PropTypes.object.isRequired,
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
            <TagPanel
              myBevies={ this.props.myBevies }
              activeBevy={ this.props.activeBevy }
              activeTags={ this.props.activeTags }
              allBevies={ this.props.allBevies }
            />
            <SiblingPanel
              activeBevy={ this.props.activeBevy }
              allBevies={ this.props.allBevies }
              myBevies={ this.props.myBevies }
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LeftSidebar;
