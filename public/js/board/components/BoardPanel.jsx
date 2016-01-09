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
var SubscriberModal = require('./../../bevy/components/SubscriberModal.jsx');

var _ = require('underscore');
var router = require('./../../router');
var constants = require('./../../constants');
var resizeImage = require('./../../shared/helpers/resizeImage');
var BoardActions = require('./../BoardActions');
var BoardStore = require('./../BoardStore');
var user = window.bootstrap.user;

var BoardPanel = React.createClass({
  propTypes: {
    board: React.PropTypes.object,
    bevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      joined: (_.contains(window.bootstrap.user.boards, this.props.board._id)),
      isBevyMember: (_.contains(window.bootstrap.user.bevies, this.props.bevy._id)),
      showSubModal: false
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      joined: (_.contains(window.bootstrap.user.boards, nextProps.board._id)),
      isBevyMember: (_.contains(window.bootstrap.user.bevies, nextProps.bevy._id)),
    });
  },

  onRequestJoin(ev) {
    ev.preventDefault();
    if(this.props.board.settings.privacy == "Private") {
      BoardActions.requestJoin(this.props.bevy, window.bootstrap.user);
      this.refs.snackbar.show();
    }
    else {
      BoardActions.join(this.props.board);
      var joined = true;
      this.setState({
        joined: joined
      });
    }
  },

  onRequestLeave(ev) {
    ev.preventDefault();
    BoardActions.leave(this.props.board);
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
        <div
          className='board-image'
          style={{ backgroundImage: 'url(' + boardImageURL + ')' }}
        />
      );
    }
  },

  _renderBoardSubs() {
    return (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='substooltip'>
            { this.props.board.subCount + ' ' +
              ((this.props.board.subCount == 1)
                ? 'subscriber'
                : 'subscribers')}
          </Tooltip>
        }>
          <FlatButton
            onClick={() => this.setState({ showSubModal: true })}
            style={{
              minWidth: 0,
              lineHeight: 1.42,
              height: 'auto',
              padding: '4px 6px',
              backgroundColor: 'transparent'
            }}
          >
            <span className='sub-count'>
              { this.props.board.subCount }
            </span>
            <i className="material-icons">people</i>
          </FlatButton>
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
        <span className='info-item-body'>
          { type }
        </span>
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

  _renderJoinLeaveButton() {
    if(!this.state.isBevyMember) return <div />;
    return (this.state.joined)
      ? this._renderLeaveButton()
      : this._renderJoinButton();
  },

  render() {
    var board = this.props.board;
    var boardImageURL = (_.isEmpty(this.props.board.image))
      ? '/img/default_board_img.png'
      : resizeImage(this.props.board.image, 64, 64).url;
    var boardImageStyle = { backgroundImage: 'url(' + boardImageURL + ')' };

    var created = new Date(board.created).toLocaleDateString();
    var details = (
      <div className='left'>
        <span>Created on { created }</span>
      </div>
    );

    return (
      <div className="panel board-panel">
        <SubscriberModal
          show={ this.state.showSubModal }
          onHide={() => this.setState({ showSubModal: false })}
          activeBoard={ this.props.board }
        />
        <div className='top'>
          { this._renderAvatar(boardImageURL) }
          <div className='panel-info'>
            <a
              className='title'
              title={ this.props.board.name }
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
            {/* this._renderBoardSubs() */}
            { this._renderBoardType() }
          </div>
          <div className='right'>
            {/* this._renderJoinLeaveButton() */}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BoardPanel;
