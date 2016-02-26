/**
 * BoardNavbar.jsx
 *
 * the navbar for each board
 * 
 * @author  kevin
 * @flow
 */

'use strict';

var React = require('react');


var BoardNavbar = React.createClass({
  propTypes: {
    activeBoard: React.PropTypes.object
  },

  render() {
    var board = this.props.activeBoard;
    return (
        <div className='board-navbar'>
          <div className='left'>
            <div className='title'>
              {board.name}
            </div>  
          </div>
          <div className='right'>
            <button onClick={this.props.toggleSidebar}>
              open sidemenu
            </button>
          </div>
        </div>
      );
  }

});

module.exports = BoardNavbar;