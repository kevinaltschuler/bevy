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
  Avatar,
  Card,
  CardHeader
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
      ? '/img/default_board_img.png' 
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

    if(boardImage == 'http://bevy.dev/img/default_board_img.png' ) {
      var avatar = <Avatar size={40} icon={<i className="material-icons">view_carousel</i>}/>
    } else {
      var avatar = <Avatar size={40} style={{width: 40, height: 40}} src={boardImage} />;
    }

    console.log(boardImage);

    return (
    <div>
      <div className="panel public-board-panel">
        <div className='top'>
          {avatar}
          <div className='panel-info'>
              <a 
                className='title' 
                href={ this.props.board.url }
              >
                { name + 'dnaisjbdbiasfbiufbuifsbui'}
              </a>
              <div className='description'>
                { description }
              </div>
          </div>
        </div>
        <div className='bottom'>
          asdasasd
        </div>
      </div>
    </div>
    );
  }
});

module.exports = BoardPanel;
