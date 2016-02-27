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
var Ink = require('react-ink');

var BoardNavbar = React.createClass({
  propTypes: {
    activeBoard: React.PropTypes.object
  },

  render() {
    var infoIcon = (this.props.sidebarOpen) 
      ? <i style={{color: '#2cb673'}} className="material-icons">info_outline</i> 
      : <i className="material-icons">info_outline</i>;
    var buttonStyle = (this.props.sidebarOpen)
    ?  {boxShadow: 'inset 0 1px 2px 0 rgba(0,0,0,.075)'}
    :  {};
    var board = this.props.activeBoard;
    return (
        <div className='board-navbar'>
          <div className='left'>
            <div className='title'>
              {board.name}
            </div>  
          </div>
          <div className='right'>
            <button style={buttonStyle} className='info-button' onClick={this.props.toggleSidebar}>
              <Ink/>
              {infoIcon}
            </button>
          </div>
        </div>
      );
  }

});

module.exports = BoardNavbar;