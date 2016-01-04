/**
 * BoardView.jsx
 *
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');
var {
  RaisedButton,
  Snackbar
} = require('material-ui');
var PostSort = require('./../../post/components/PostSort.jsx');
var PostContainer = require('./../../post/components/PostContainer.jsx');
var NewPostPanel = require('./../../post/components/NewPostPanel.jsx');
var BoardInfoPanel = require('./../../board/components/BoardInfoPanel.jsx');
var Footer = require('./../../app/components/Footer.jsx')

var _ = require('underscore');
var router = require('./../../router');
var BevyStore = require('./../../bevy/BevyStore');
var BevyActions = require('./../../bevy/BevyActions');
var BoardActions = require('./../../board/BoardActions');

var BoardView = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    allThreads: React.PropTypes.array,
    allBevies: React.PropTypes.array,
    activeBoard: React.PropTypes.object
  },

  onRequestJoin(ev) {
    ev.preventDefault();
    //BoardActions.requestJoin(this.props.board, window.bootstrap.user);
    this.refs.snackbar.show();
  },

  componentDidMount() {
    setTimeout(function() {
      BoardActions.loadBoardView(router.board_id);
    }, 1);
  },

  render() {
    var joinedBoard = false;
    var joinedParent = false;
    var activeBoard = this.props.activeBoard;
    var parent = activeBoard.parent;

    if(_.isEmpty(activeBoard) || _.isEmpty(parent)) {
      return <div/>;
    }

    if(_.isEmpty(window.bootstrap.user)) {
      joinedParent = false;
    }

    if(_.find(window.bootstrap.user.bevies,
      function(bevyId) {
      return bevyId == parent._id
    }.bind(this))) {
      joinedParent = true;
    }

    if(_.find(window.bootstrap.user.boards,
      function(boardId) {
      return boardId == activeBoard._id
    }.bind(this))) {
      joinedBoard = true;
    }

    if(!joinedParent && parent.settings.privacy == 'Private') {
      return (
        <div className='main-section private-container'>
          <div className='private panel'>
            <div className='private-img'/>
            This commmunity is private
          </div>
        </div>
      );
    }

    if(!joinedBoard && activeBoard.settings.privacy == 'Private') {
      return (
      <div className='main-section private-container'>
        <div className='private panel'>
          <div className='private-img'/>
          you must be approved by an <br/>admin to view this board<br/><br/>
          <RaisedButton label='request join' onClick={ this.onRequestJoin }/>
          <Snackbar
            message="Invitation Requested"
            autoHideDuration={5000}
            ref='snackbar'
            style={{fontSize: '14px', fontWeight: '300'}}
          />
        </div>
      </div>
      );
    }

    var body = (
      <div>
        <NewPostPanel
          activeBevy={ this.props.activeBevy }
          activeBoard={this.props.activeBoard}
          myBevies={ this.props.myBevies }
        />
        <PostContainer
          activeBevy={ this.props.activeBevy }
          activeBoard={this.props.activeBoard}
        />
      </div>
    );

    return (
      <div className='main-section'>
        <div className='board-view-sidebar'>
          <BoardInfoPanel
            board={ this.props.activeBoard }
            myBevies={ this.props.myBevies }
          />
          <Footer />
        </div>
        <div className='board-view-body'>
          { body }
        </div>
      </div>
    );
    }
});

module.exports = BoardView;
