/**
 * BevyView.jsx
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var Ink = require('react-ink');
var {
  RaisedButton,
  Snackbar,
  FontIcon,
  TextField
} = require('material-ui');
var PostSort = require('./../../post/components/PostSort.jsx');
var PostContainer = require('./../../post/components/PostContainer.jsx');
var NewPostPanel = require('./../../post/components/NewPostPanel.jsx');
var BoardPanel = require('./../../board/components/BoardPanel.jsx');
var Footer = require('./../../app/components/Footer.jsx');
var NewBoardModal = require('./../../board/components/NewBoardModal.jsx');
var BevyInfoBar = require('./BevyInfoBar.jsx');

var Ink = require('react-ink');
var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var UserStore = require('./../../user/UserStore');
var BevyActions = require('./../../bevy/BevyActions');
var PostStore = require('./../../post/PostStore');
var PostActions = require('./../../post/PostActions');
var USER = constants.USER;

var BevyView = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    allThreads: React.PropTypes.array,
    allBevies: React.PropTypes.array,
  },

  getInitialState() {
    return {
      showNewBoardModal: false,
      searchOpen: false,

    }
  },

  componentDidMount() {
    console.log('LOADING DATA');
    BevyActions.loadBevyView(router.bevy_slug);
  },

  onRequestJoin(ev) {
    ev.preventDefault();
    BevyActions.requestJoin(this.props.activeBevy, window.bootstrap.user);
    this.refs.snackbar.show();
  },

  search(queryArg) {
    var bevy_id = this.props.activeBevy._id;
    var query = this.state.query;

    if(!_.isEmpty(queryArg)) {
      query = queryArg;
    }

    PostActions.search(query, bevy_id);
  },

  onSearchChange(ev) {
    var query = this.SearchInput.getValue();
    // reset the timeout if it already exists
    clearTimeout(this.searchTimeout);
    // make searching smoother with a bit of lag
    this.searchTimeout = setTimeout(() => { this.search(query) }, 300);
  },

  _openSearch() {
    // check first if any posts exist
    // dont allow searching if no posts exist
    if(PostStore.getAll().length <= 0) {
      return;
    }
    // send out the initial search call to get a generic list of posts
    this.search();
    // once the animation finishes, focus the search textinput
    setTimeout(() => { this.SearchInput.focus() }, 500);
    this.setState({
      searchOpen: !this.state.searchOpen
    });
  },

  _renderBoards() {
    var bevy = this.props.activeBevy;
    var boardList = [];
    var boards = this.props.boards;
    for(var key in boards) {
      var board = boards[key];
      boardList.push(
        <BoardPanel
          key={ 'boardpanel:' + board._id }
          board={ board }
          bevy={ bevy }
        />
      );
    }
    boardList.push(
      <div
        key='new-board-card'
        className='new-board-card'
        onClick={() => { this.setState({ showNewBoardModal: true }); }}
      >
        <div className='plus-icon'>
          <FontIcon
            className='material-icons'
            style={{color: 'rgba(0,0,0,.2)', fontSize: '40px'}}
          >
            add
          </FontIcon>
        </div>
        <div className='new-board-text'>
          Create a New Board
        </div>
        <Ink style={{width: '100%', height: '100%', top: 0, left: 0}}/>
      </div>
    );
    return boardList;
  },

  render() {
    var joined = false;
    var activeBevy = this.props.activeBevy;

    if(_.isEmpty(window.bootstrap.user) || this.props.activeBevy.name == null) {
      return <div/>;
    }
    
    return (
      <div className='main-section bevy-view'>
        <NewBoardModal
          show={ this.state.showNewBoardModal }
          onHide={() => { this.setState({ showNewBoardModal: false }) }}
          activeBevy={ this.props.activeBevy }
        />
        <div className='board-list'>
          <div className='bevy-view-title'>Boards</div>
          { this._renderBoards() }
          <div style={{height: 10}}/>
          <Footer />
        </div>
        <div className='bevy-view-body'>
          <div style={{
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            width: '100%',
          }}>
            <div className='bevy-view-title'>{(this.state.searchOpen) ? 'Search': 'Feed'}</div>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
              <TextField 
                style={{display: (this.state.searchOpen) ? 'initial': 'none'}} 
                underlineFocusStyle={{borderColor: '#666'}}
                ref={(ref) => this.SearchInput = ref}
                onChange={this.onSearchChange}
              />
              <div 
                style={{
                  cursor: 'pointer', 
                  position: 'relative', 
                  width: 30, 
                  height: 30, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginLeft: 10,
                  marginBottom: 5
                }}
                onClick={this._openSearch}
              >
                <Ink/>
                <i style={{color: '#888'}} className="material-icons">{(!this.state.searchOpen) ? 'search' : 'clear'}</i>
              </div>
            </div>
          </div>
          <div>
            <PostContainer
              activeBevy={ this.props.activeBevy }
              searchOpen={this.state.searchOpen}
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BevyView;
