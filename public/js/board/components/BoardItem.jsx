/**
 * BoardItem.jsx
 * formerly BevyPanel.jsx
 * formerly BoardPanel.jsx
 * item in the board sidebar (BoardSidebar.jsx)
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
var Ink = require('react-ink');

var _ = require('underscore');
var router = require('./../../router');
var constants = require('./../../constants');
var resizeImage = require('./../../shared/helpers/resizeImage');

var AppActions = require('./../../app/AppActions');

var BoardItem = React.createClass({
  propTypes: {
    board: React.PropTypes.object,
    bevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object
  },

  getInitialState() {
    return {
      joined: (_.contains(window.bootstrap.user.boards, this.props.board._id)),
      selected: this.props.board._id == this.props.activeBoard._id
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      joined: (_.contains(window.bootstrap.user.boards, nextProps.board._id)),
      selected: nextProps.board._id == nextProps.activeBoard._id
    });
  },

  openDirectory() {
    AppActions.openSidebar('directory', {
      initialDirectoryTab: 'member'
    });
  },

  onClick() {
    // if we're already in this board, then return and dont navigate
    if(this.props.activeBoard._id == this.props.board._id) return;
    
    router.navigate('/boards/' + this.props.board._id, { trigger: true });
  },

  renderAvatar(boardImageURL) {
    if(boardImageURL == 'http://bevy.dev/img/default_board_img.png'
      || boardImageURL == '/img/default_board_img.png') {
      return (
        <div className='board-image-icon'>
          <i className="material-icons">view_carousel</i>
        </div>
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

  renderBoardType() {
    var type;
    switch(this.props.board.type) {
      case 'discussion':
        type = (
          <div className='type'>
            <i style={{marginRight: 10}} className="material-icons">question_answer</i>
            <span className='type-text'>Discussion</span>
          </div>
        );
        break;
      case 'announcement':
        type = (
          <div className='type'>
            <i style={{marginRight: 10}} className="material-icons">flag</i>
            <span className='type-text'>Announcements</span>
          </div>
        );
        break;
      default:
        type = <div />;
        break;
    }
    return (
      <OverlayTrigger
        placement='right'
        overlay={
          <Tooltip id='board-type'>
            { this.props.board.type.charAt(0).toUpperCase()
              + this.props.board.type.slice(1) + ' Board' }
          </Tooltip>
        }
      >
        { type }
      </OverlayTrigger>
    );
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
      <div className='board-item-container'>
        <button
          className='board-item'
          title={ 'View posts in ' + this.props.board.name }
          onClick={ this.onClick }
          style={{
            //backgroundColor: (this.state.selected) ? '#2CB673' : 'transparent'
          }}
        >
          <Ink
            opacity={ 0.25 }
            background={ true }
            style={{ color: '#FFF' }}
          />
          <div
            className='color-monkey'
            style={{
              width: (this.state.selected) ? '100%' : '0px'
            }}
          />
          { this.renderAvatar(boardImageURL) }
          <span style={{fontWeight:(this.state.selected)?600:300}} className='name'>
            { this.props.board.name }
          </span>
          { this.renderBoardType() }
        </button>
      </div>
    );
  }
});

module.exports = BoardItem;
