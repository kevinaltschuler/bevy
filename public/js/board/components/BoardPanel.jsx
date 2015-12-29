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
      joined: (_.contains(window.bootstrap.user.boards, this.props.board._id))
    };
  },

  onRequestJoin(ev) {
    ev.preventDefault();
    if(this.props.board.settings.privacy == "Private") {
      BoardActions.requestJoin(this.props.bevy, window.bootstrap.user);
      this.refs.snackbar.show();
    } 
    else {
      BoardActions.join(
        this.props.board._id
      );
      var joined = true;
      this.setState({
        joined: joined
      });
    }
  },

  onRequestLeave(ev) {
    ev.preventDefault();
    console.log('leave');
    BoardActions.leave(this.props.board._id);
    this.setState({
      joined: false
    });
  },

  _renderBottomActions() {

    var board = this.props.board;
    var user = window.bootstrap.user;

    var joinButton = (board.settings.privacy == 'Private')
    ? (<div>
        <Snackbar
          message="Invitation Requested"
          autoHideDuration={5000}
          ref='snackbar'
        />
        <RaisedButton 
          disabled={_.isEmpty(window.bootstrap.user)} 
          label='request' 
          onClick={ this.onRequestJoin } 
        />
      </div>)
    : <RaisedButton label='join' onClick={this.onRequestJoin}/>;
    var leaveButton = <FlatButton label='leave' onClick={this.onRequestLeave}/>

    var joinLeave = (this.state.joined)
    ? leaveButton
    : joinButton;

    var publicPrivate = (board.settings.privacy == 'Private')
    ?  (
        <OverlayTrigger placement='bottom' overlay={<Tooltip>Private</Tooltip>}>
          <i className="material-icons">lock</i>
        </OverlayTrigger>
      )
    : (
      <OverlayTrigger placement='bottom' overlay={<Tooltip>Public</Tooltip>}>
        <i className="material-icons">public</i>
      </OverlayTrigger>
    );

    var subs = (
      <OverlayTrigger placement='bottom' overlay={<Tooltip>{board.subCount + " subscribers"}</Tooltip>}>
        <i className="material-icons">people</i>
      </OverlayTrigger>
    );

    return(
      <div className='bottom'>
        <div className='left'>
          <div className='info-item'>
            { subs }
          </div>
          <div className='info-item'>
            { publicPrivate }
          </div>
        </div>
        <div className='right'>
          {joinLeave}
        </div>
      </div>
    );
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
      var avatar = <Avatar size={40} style={{width: 40, height: 40, minWidth: 40}} sicon={<i className="material-icons">view_carousel</i>}/>
    } else {
      var avatar = <Avatar size={40} style={{width: 40, height: 40, minWidth: 40}} src={boardImage} />;
    }

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
                { name }
              </a>
              <div className='description'>
                { description }
              </div>
          </div>
        </div>
        { this._renderBottomActions() }
      </div>
    </div>
    );
  }
});

module.exports = BoardPanel;
