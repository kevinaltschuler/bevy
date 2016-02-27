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
var Footer = require('./../../app/components/Footer.jsx');
var PostSort = require('./../../post/components/PostSort.jsx');
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
var BoardStore = require('./../../board/BoardStore');
var PostActions = require('./../../post/PostActions');
var USER = constants.USER;
var BOARD = constants.BOARD;

var BevyView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object,
    boards: React.PropTypes.array
  },

  getInitialState() {
    return {
      query: '',
      sidebarOpen: false,
      bodyStyle: {}
    }
  },

  componentDidMount() {
    console.log('LOADING DATA');
    //BevyActions.loadBevyView(router.bevy_slug);
    BoardStore.on(BOARD.SWITCHED, this.onBoardSwitch);
  },

  onRequestJoin(ev) {
    ev.preventDefault();
    BevyActions.requestJoin(this.props.activeBevy, window.bootstrap.user);
    this.refs.snackbar.show();
  },

  onBoardSwitch() {
    this.setState({
      bodyStyle: {opacity: .05}
    });
    setTimeout(
      () => this.setState({
        bodyStyle: {opacity: 1}
      }),
      10
    )
  },

  search(queryArg) {
    var bevy_id = this.props.activeBevy._id;
    var query = this.state.query;

    if(!_.isEmpty(queryArg)) query = queryArg;

    PostActions.search(query, bevy_id);
  },

  clearSearch() {
    this.setState({ query: '' });
  },

  onQueryChange(ev) {
    var query = this.refs.search.getValue();
    this.setState({ query: query });
    // reset the timeout if it already exists
    clearTimeout(this.searchTimeout);
    // make searching smoother with a bit of lag
    this.searchTimeout = setTimeout(() => { this.search(query) }, 300);
  },

  renderNewPostPanel() {
    if(this.props.activeBoard._id == undefined) return <div />;
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
    this.setState({
      sidebarOpen: !this.state.sidebarOpen
    })
  },

  render() {
    var joined = false;
    var activeBevy = this.props.activeBevy;

    if(_.isEmpty(window.bootstrap.user) || this.props.activeBevy.name == null) {
      return <div/>;
    }

    return (
      <div
        className='main-section bevy-view'
        style={{
          paddingRight: (this.props.activeBoard._id == undefined || !this.state.sidebarOpen) ? 0 : 235
        }}
      >
        <BoardSidebar
          activeBevy={ this.props.activeBevy }
          boards={ this.props.boards }
          activeBoard={ this.props.activeBoard }
        />
        <div style={this.state.bodyStyle} className='bevy-view-body'>
          <BoardNavbar 
            activeBoard={this.props.activeBoard}
            toggleSidebar={this.toggleSidebar}
            sidebarOpen={this.state.sidebarOpen}
          />
          <div className='bevy-view-content'>
            <div className='header'>
              <Input
                ref='search'
                type='text'
                placeholder='Search'
                value={ this.state.query }
                onChange={ this.onQueryChange }
                addonBefore={
                  <i className='material-icons'>search</i>
                }
                addonAfter={ this.renderClearSearchButton() }
              />
              <PostSort
                activeBevy={ this.props.activeBevy }
                activeBoard={ this.props.activeBoard }
              />
            </div>
            { this.renderNewPostPanel() }
            <PostContainer
              activeBevy={ this.props.activeBevy }
              activeBoard={ this.props.activeBoard }
              searchOpen={ (!_.isEmpty(this.state.query) && !this.state.searching) }
              searchQuery={ this.state.query }
            />
            <Footer />
          </div>
        </div>
        <div style={this.state.bodyStyle}>
        <BoardInfoSidebar
          activeBevy={ this.props.activeBevy }
          activeBoard={ this.props.activeBoard }
          open={this.state.sidebarOpen}
          toggleSidebar={this.toggleSidebar}
        />
        </div>
      </div>
    );
  }
});

module.exports = BevyView;
