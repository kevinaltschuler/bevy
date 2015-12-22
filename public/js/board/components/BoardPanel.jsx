/**
 * BoardPanel.jsx
 * formerly BevyPanel.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var {
  Button,
  OverlayTrigger,
  Tooltip
} = require('react-bootstrap');
var {
  RaisedButton,
  FlatButton,
  Snackbar,
} = require('material-ui');

var _ = require('underscore');
var router = require('./../../router');
var constants = require('./../../constants');
var BoardActions = require('./../BoardActions');
var BoardStore = require('./../BoardStore');
var user = window.bootstrap.user;

var BoardPanel = React.createClass({
  propTypes: {
    board: React.PropTypes.object,
    boards: React.PropTypes.array.isRequired
  },

  getInitialState() {
    var board = this.props.board;

    return {
      name: board.name || '',
      description: board.description || '',
      image: board.image || {},
    };
  },

  render() {

    var board = this.props.board;
    //console.log(board);
    var boardImage = (_.isEmpty(this.state.image)) 
      ? '/img/default_group_img.png' 
      : this.state.image.path;
    var boardImageStyle = { backgroundImage: 'url(' + boardImage + ')' };

    var name = (_.isEmpty(board)) 
      ? '' 
      : this.state.name;
    var description = (_.isEmpty(board)) 
      ? 'no description' 
      : this.state.description;
    if(_.isEmpty(description)) description = 'no description';

    var created = new Date(board.created).toLocaleDateString();

    var details = (
      <div className='left'>
        <span>Created on { created }</span>
      </div>
    );

    return (
      <div className="panel public-board-panel">
        <a 
          className="board-panel-top" 
          href={ this.props.board.url } 
          style={ boardImageStyle }
        />
        <div className='panel-info'>
            <a 
              className='title' 
              href={ this.props.board.url }
            >
              { name }
            </a>
        </div>
      </div>
    );
  }
});

module.exports = BoardPanel;
