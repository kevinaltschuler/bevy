/**
 * LeftSidebar.jsx
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');

var BevyPanel = require('./../../bevy/components/BevyPanel.jsx');
var Footer = require('./Footer.jsx');

var LeftSidebar = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array.isRequired,
    activeBevy: React.PropTypes.object.isRequired,
    allBevies: React.PropTypes.array
  },

  render() {
    return (
      <div className='left-sidebar'>
        <div className='fixed'>
          <div className='hide-scroll'>
            <BevyPanel
              activeBevy={ this.props.activeBevy }
              myBevies={ this.props.myBevies }
            />
            <Footer />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LeftSidebar;
