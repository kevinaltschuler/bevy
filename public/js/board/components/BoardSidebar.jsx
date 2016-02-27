/**
 * BoardSidebars.jsx
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var Ink = require('react-ink');
var BoardItem = require('./BoardItem.jsx');
var NewBoardModal = require('./NewBoardModal.jsx');
var BevyInfoBar = require('./../../bevy/components/BevyInfoBar.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var resizeImage = require('./../../shared/helpers/resizeImage');

var BoardActions = require('./../../board/BoardActions');

var BoardSidebar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    boards: React.PropTypes.array,
    activeBoard: React.PropTypes.object
  },

  getInitialState() {
    return {
      showNewBoardModal: false
    };
  },

  showNewBoardModal(ev) {
    ev.preventDefault();
    this.setState({ showNewBoardModal: true });
  },

  onHomeClick() {
    router.navigate('/', { trigger: true });
    BoardActions.switchBoard(null);
  },

  renderBoards() {
    let boardItems = [];
    for(var key in this.props.boards) {
      let board = this.props.boards[key];
      boardItems.push(
        <BoardItem
          key={ 'board-item:' + key }
          board={ board }
          bevy={ this.props.activeBevy }
          activeBoard={ this.props.activeBoard }
        />
      );
    }
    return (
      <div className='board-list'>
        { boardItems }
      </div>
    );
  },

  render() {
    return (
      <div className='board-sidebar'>
        <div className='header'>
          <div
            className='bevy-image'
            style={{
              backgroundImage: 'url(' + resizeImage(this.props.activeBevy.image, 128, 128).url + ')'
            }}
          >
            <div className='darkener' />
            <span className='bevy-name'>
              { this.props.activeBevy.name }
            </span>
            <BevyInfoBar
              activeBevy={ this.props.activeBevy }
            />
          </div>
          <button
            className='home-button'
            title={ 'View ' + this.props.activeBevy.name + ' post feed' }
            onClick={ this.onHomeClick }
          >
            <Ink
              opacity={ 0.25 }
              background={ true }
              style={{ color: '#FFF' }}
            />
            <div
              className='color-monkey'
              style={{
                width: (this.props.activeBoard._id == undefined) ? '100%' : 0
              }}
            />
            <i className='material-icons'>home</i>
            <span className='home-button-text'>
              Home Feed
            </span>
          </button>
        </div>
        <div className='board-title-container'>
          <span className='board-title'>
            Boards ({ (this.props.boards.length == 0) ? '...' : this.props.boards.length })
          </span>
          <button
            className='add-button'
            title='Create a new board'
            onClick={ this.showNewBoardModal }
          >
            <Ink
              opacity={ 0.25 }
              background={ true }
              style={{ color: '#FFF' }}
            />
            <i className='material-icons'>add</i>
            <NewBoardModal
              show={ this.state.showNewBoardModal }
              onHide={() => this.setState({ showNewBoardModal: false })}
              activeBevy={ this.props.activeBevy }
            />
          </button>
        </div>
        { this.renderBoards() }
      </div>
    );
  }
});

module.exports = BoardSidebar;
