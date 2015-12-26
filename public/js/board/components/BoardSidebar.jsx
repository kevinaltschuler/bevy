/**
 * BoardSidebar.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');

var InfoPanel = require('./InfoPanel.jsx');
var Footer = require('./../../app/components/Footer.jsx');
var _ = require('underscore');

var BoardSidebar = React.createClass({

  propTypes: {
    board: React.PropTypes.object
  },

  getInitialState() {
    return {};
  },

  render() {
    
    var board = this.props.board;
    if(_.isEmpty(board)) {
      return <div/>;
    }
    var board_id = board._id;

    return (
      <div className='left-sidebar'>
        <div className='fixed'>
          <div className='hide-scroll'>
            <InfoPanel
              board={ this.props.board }
              myBevies={ this.props.myBevies }
            />
            <Footer />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BoardSidebar;
