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
      joined: (_.contains(window.bootstrap.user.boards, this.props.board._id))
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      joined: (_.contains(window.bootstrap.user.boards, nextProps.board._id))
    });
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
    BoardActions.leave(this.props.board._id);
    this.setState({
      joined: false
    });
  },

  _renderAvatar(boardImageURL) {
    if(boardImageURL == 'http://bevy.dev/img/default_board_img.png'
      || boardImageURL == '/img/default_board_img.png') {
      return (
        <Avatar
          size={ 40 }
          style={{
            width: 40,
            height: 40,
            minWidth: 40
          }}
          icon={
            <i className="material-icons">view_carousel</i>
          }
        />
      );
    } else {
      return (
        <Avatar
          size={ 40 }
          style={{
            width: 40,
            height: 40,
            minWidth: 40
          }}
          src={ boardImageURL }
        />
      );
    }
  },

  _renderBoardSubs() {
    return (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='substooltip'>{this.props.board.subCount + " subscribers"}</Tooltip>
        }>
          <i className="material-icons">people</i>
        </OverlayTrigger>
      </div>
    );
  },

  _renderBoardType() {
    var type;
    switch(this.props.board.type) {
      case 'discussion':
        type = (
          <OverlayTrigger placement='bottom' overlay={
            <Tooltip id='discusstooltip'>Discussion</Tooltip>
          }>
            <i className="material-icons">question_answer</i>
          </OverlayTrigger>
        );
        break;
      case 'event':
        type = (
          <OverlayTrigger placement='bottom' overlay={
            <Tooltip id='eventtooltip'>Events</Tooltip>
          }>
            <i className="material-icons">event</i>
            </OverlayTrigger>
          );
        break;
      case 'announcement':
        type = (
          <OverlayTrigger placement='bottom' overlay={
            <Tooltip id='annoucetooltip'>Announcements</Tooltip>
          }>
            <i className="material-icons">flag</i>
          </OverlayTrigger>
        );
        break;
      default:
        type = <div />;
        break;
    }
    return (
      <div className='info-item'>
        { type }
      </div>
    );
  },

  _renderJoinButton() {
    if(this.props.board.settings.privacy == 'Private') {
      return (
        <div>
          <Snackbar
            message="Invitation Requested"
            autoHideDuration={5000}
            ref='snackbar'
          />
          <FlatButton
            disabled={_.isEmpty(window.bootstrap.user)}
            label='request'
            onClick={ this.onRequestJoin }
          />
        </div>
      );
    } else {
      return (
        <FlatButton label='join' onClick={ this.onRequestJoin }/>
      );
    }
  },

  _renderLeaveButton() {
    return (
      <FlatButton label='leave' onClick={ this.onRequestLeave } />
    )
  },

  render() {
    var board = this.props.board;
    var boardImageURL = (_.isEmpty(this.props.board.image))
      ? '/img/default_board_img.png'
      : this.props.board.image.path;
    var boardImageStyle = { backgroundImage: 'url(' + boardImageURL + ')' };

    var created = new Date(board.created).toLocaleDateString();
    var details = (
      <div className='left'>
        <span>Created on { created }</span>
      </div>
    );

    return (
      <div className="panel board-panel">
        <div className='top'>
          { this._renderAvatar(boardImageURL) }
          <div className='panel-info'>
            <a
              className='title'
              href={ this.props.board.url } >
              { this.props.board.name }
            </a>
            <div className='description'>
              { this.props.board.description }
            </div>
          </div>
        </div>
        <div className='bottom'>
          <div className='left'>
            { this._renderBoardSubs() }
            { this._renderBoardType() }
          </div>
          <div className='right'>
            { (this.state.joined)
              ? this._renderLeaveButton()
              : this._renderJoinButton()
            }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BoardPanel;
