/**
 * BoardNavbar.jsx
 *
 * the navbar for each board
 *
 * @author kevin "bugwriter brown" altschuler
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var Ink = require('react-ink');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');

var BoardNavbar = React.createClass({
  propTypes: {
    activeBoard: React.PropTypes.object,
    sidebarOpen: React.PropTypes.bool
  },

  renderInfoIcon() {
    if(this.props.sidebarOpen) {
      return <i style={{color: '#2cb673'}} className="material-icons">info_outline</i>;
    } else {
      return <i className="material-icons">info_outline</i>;
    }
  },

  render() {
    return (
      <div className='board-navbar'>
        <div className='left'>
          <div className='title'>
            { this.props.activeBoard.name }
          </div>
        </div>
        <div className='right'>
          <button
            style={(this.props.sidebarOpen)
              ? { boxShadow: 'inset 0 1px 2px 0 rgba(0,0,0,.075)' }
              : {}}
            className='info-button'
            onClick={ this.props.toggleSidebar }
          >
            <Ink/>
            { this.renderInfoIcon() }
          </button>
        </div>
      </div>
    );
  }

});

module.exports = BoardNavbar;
