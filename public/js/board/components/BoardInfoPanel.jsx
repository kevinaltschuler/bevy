/**
 * InfoPanel.jsx
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  FlatButton,
  RaisedButton
} = require('material-ui');
var BoardSettingsModal = require('./BoardSettingsModal.jsx');
var BoardInfoPanelHeader = require('./BoardInfoPanelHeader.jsx');
var AdminModal = require('./../../bevy/components/AdminModal.jsx');
var BoardActions = require('./../BoardActions');

var _ = require('underscore');
var constants = require('./../../constants');

var BoardInfoPanel = React.createClass({
  propTypes: {
    board: React.PropTypes.object
  },

  getInitialState() {
    return {
      joined: (_.contains(window.bootstrap.user.boards, this.props.board._id)),
      isAdmin: _.findWhere(this.props.board.admins, 
        { _id: window.bootstrap.user._id }) != undefined,
      showSettingsModal: false,
      showAdminModal: false
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      joined: (_.contains(window.bootstrap.user.boards, nextProps.board._id)),
      isAdmin: _.findWhere(nextProps.board.admins,
        { _id: window.bootstrap.user._id }) != undefined
    });
  },

  onRequestJoin(ev) {
    ev.preventDefault();
    BoardActions.join(this.props.board._id);
    this.setState({
      joined: true
    });
  },

  onRequestLeave(ev) {
    ev.preventDefault();
    BoardActions.leave(this.props.board._id);
    this.setState({
      joined: false
    });
  },

  _renderPublicPrivate() {
    if(this.props.board.settings.privacy == 'Public') {
      return (
        <span className='info-item'>
          <i className="material-icons">public</i>
          &nbsp;Public
        </span>
      );
    } else {
      return (
        <span className='info-item'>
          <i className="material-icons">lock</i>
          &nbsp;Private
        </span>
      );
    }
  },

  _renderType() {
    switch(this.props.board.type) {
      case 'discussion':
        return (
          <span className='info-item'>
            <i className="material-icons">question_answer</i>
            &nbsp;Discussion
          </span>
        );
        break;
      case 'event':
        return (
          <span className='info-item'>
            <i className="material-icons">event</i>
            &nbsp;Event
          </span>
        );
        break;
      case 'announcement':
        return (
          <span className='info-item'>
            <i className="material-icons">flag</i>
            &nbsp;Annoucements
          </span>
        );
        break;
      default:
        return <div />;
        break;
    }
  },

  _renderBottomActions() {
    if(_.isEmpty(window.bootstrap.user)) return <div />;

    var joinButton = (this.state.joined)
    ? <FlatButton label='leave' onClick={ this.onRequestLeave } />
    : <RaisedButton label='join' onClick={ this.onRequestJoin } />

    if(this.state.isAdmin) {
      return (
        <div className='sidebar-bottom'>
          <FlatButton
            label='Settings'
            onClick={() => { this.setState({ showSettingsModal: true }); }}
          />
          <BoardSettingsModal
            board={ this.props.board }
            show={ this.state.showSettingsModal }
            onHide={() => { this.setState({ showSettingsModal: false }); }}
          />
          { joinButton }
        </div>
      );
    } else {
      return (
        <div className='sidebar-bottom'>
          <div style={{ flex: 1 }} />
          { joinButton }
        </div>
      );
    }
  },

  render() {
    var board = this.props.board;
    if(_.isEmpty(board)) return <div/>;

    return (
      <div className="board-info-panel panel">
        <BoardInfoPanelHeader {...this.props}/>
        <div className='board-info'>
          <div className='info-item'>
            <i className="material-icons">people</i>
            <a
              href='#'
              className='members-button'
              onClick={(ev) => {
                ev.preventDefault();
              }}>
              { board.subCount }
              &nbsp;
              { (board.subCount == 1)
                ? 'subscriber'
                : 'subscribers' }
            </a>
          </div>
          <div className='info-item' >
            <i className="material-icons">person</i>
            <a
              href='#'
              className='admin-button'
              onClick={(ev) => {
                ev.preventDefault();
                if(board.admins.length <= 0) return;
                this.setState({
                  showAdminModal: true
                });
              }}
            >
              { board.admins.length }
              &nbsp;
              { (board.admins.length == 1)
                ? 'admin'
                : 'admins' }
            </a>
          </div>
          {/* this._renderPublicPrivate() */}
          { this._renderType() }
          <AdminModal
            show={ this.state.showAdminModal }
            onHide={() => this.setState({ showAdminModal: false })}
            activeBoard={ this.props.board }
          />
        </div>
        { this._renderBottomActions() }
      </div>
    );
  }
});

module.exports = BoardInfoPanel;
