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
var {
  Input
} = require('react-bootstrap');
var PostContainer = require('./../../post/components/PostContainer.jsx');
var NewPostPanel = require('./../../post/components/NewPostPanel.jsx');
var PostView = require('./../../app/components/PostView.jsx');
// left sidebar
var BoardSidebar = require('./../../board/components/BoardSidebar.jsx');
// right sidebar
var BoardInfoSidebar = require('./../../board/components/BoardInfoSidebar.jsx');
// board navbar
var BoardNavbar = require('./../../board/components/BoardNavbar.jsx');

var Ink = require('react-ink');
var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var UserStore = require('./../../user/UserStore');
var BevyActions = require('./../../bevy/BevyActions');
var PostStore = require('./../../post/PostStore');
var BevyStore = require('./../../bevy/BevyStore');
var PostActions = require('./../../post/PostActions');
var USER = constants.USER;
var BOARD = constants.BOARD;

var BevyView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object,
    boards: React.PropTypes.array,
    allNotifications: React.PropTypes.array
  },

  getInitialState() {
    return {
      query: '',
      sidebarOpen: true,
      bodyStyle: {}
    }
  },

  componentDidMount() {
    BevyStore.on(BOARD.SWITCHED, this.onBoardSwitch);
    document.body.className = 'noscroll';
  },

  componentWillUnmount() {
    document.body.className = '';
  },

  onBoardSwitch() {
    this.clearSearch();
    // scroll to the top of the bevy view body once a board is changed
    this.refs.body.scrollTop = 0;
  },

  goBackFromPostView(ev) {
    if(ev != undefined) ev.preventDefault();
    router.navigate('/boards/' + this.props.activeBoard._id, { trigger: true });
  },

  search(queryArg) {
    var bevy_id = this.props.activeBevy._id;
    var board_id = this.props.activeBoard._id;
    var query = this.state.query;

    if(!_.isEmpty(queryArg)) query = queryArg;

    PostActions.search(query, bevy_id, board_id);
  },

  clearSearch() {
    this.setState({ query: '' });
  },

  onQueryChange(query) {
    this.setState({ query: query });
  },

  renderNewPostPanel() {
    // dont show the panel if we're not viewing a board.
    // (because you can only post to a board)
    if(this.props.activeBoard._id == undefined) return <div />;
    // dont show the panel if we're in the post view
    // (viewing only a single post)
    if(router.post_id != undefined) return <div />;

    return (
      <NewPostPanel
        activeBoard={ this.props.activeBoard }
        activeBevy={ this.props.activeBevy }
        boards={ this.props.boards }
      />
    );
  },

  renderClearSearchButton() {
    if(this.state.query.length <= 0) return <div />;
    return (
      <button
        className='clear-search'
        title='Clear Search'
        onClick={ this.clearSearch }
      >
        <Ink />
        <i className='material-icons'>close</i>
      </button>
    );
  },

  toggleSidebar() {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  },

  renderBoardNavbar() {
    if(router.current == 'post') return <div />;
    return (
      <BoardNavbar
        activeBoard={ this.props.activeBoard }
        toggleSidebar={ this.toggleSidebar }
        sidebarOpen={ this.state.sidebarOpen }
        allNotifications={ this.props.allNotifications }
        activeBevy={ this.props.activeBevy }
        onQueryChange={ this.onQueryChange }
        clearSearch={ this.clearSearch }
      />
    );
  },

  renderBody() {
    //var router = require('./../../router');
    if(router.current == 'bevy' || router.current == 'board') {
      return (
        <div
          ref='body'
          className='bevy-view-body'
        >
          <div className='bevy-view-content'>
            { this.renderNewPostPanel() }
            <PostContainer
              activeBevy={ this.props.activeBevy }
              activeBoard={ this.props.activeBoard }
              searchOpen={ (!_.isEmpty(this.state.query) && !this.state.searching) }
            />
          </div>
        </div>
      );
    } else if(router.current == 'post') {
      return (
        <PostView
          { ...this.props }
        />
      );
    } else {
      return <div>SOMETHING WENT TOTALLY WRONG</div>
    }
  },

  renderInfoBar() {
    var router = require('./../../router');
    if(router.current == 'bevy' || router.current == 'board') {
      return (
        <BoardInfoSidebar
          activeBevy={ this.props.activeBevy }
          activeBoard={ this.props.activeBoard }
          open={ this.state.sidebarOpen }
          toggleSidebar={ this.toggleSidebar }
        />
      );
    } else if (router.current == 'post') {
      return <div />;
    } else {
      return <div />;
    }
  },

  render() {
    var router = require('./../../router');
    if(_.isEmpty(window.bootstrap.user) || this.props.activeBevy.name == null) {
      return <div/>;
    }

    return (
      <div
        className='main-section bevy-view'
        style={{
          paddingRight: (this.props.activeBoard._id == undefined
            || !this.state.sidebarOpen || router.current == 'post') ? 0 : 220
        }}
      >
        <BoardSidebar
          activeBevy={ this.props.activeBevy }
          boards={ this.props.boards }
          activeBoard={ this.props.activeBoard }
          allNotifications={ this.props.allNotifications }
        />
        { this.renderBoardNavbar() }
        { this.renderBody() }
        { this.renderInfoBar() }
      </div>
    );
  }
});

module.exports = BevyView;
