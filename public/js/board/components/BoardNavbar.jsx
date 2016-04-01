/**
 * BoardNavbar.jsx
 *
 * the navbar for each board
 *
 * @author kevin "bugwriter brown" altschuler
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  Input
} = require('react-bootstrap');
var Ink = require('react-ink');
var PostSort = require('./../../post/components/PostSort.jsx');
var NotificationDropdown = require('./../../notification/components/NotificationDropdown.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var resizeImage = require('./../../shared/helpers/resizeImage');

var AppActions = require('./../../app/AppActions');
var PostActions = require('./../../post/PostActions');

var BoardNavbar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object,
    sidebarOpen: React.PropTypes.bool,
    toggleSidebar: React.PropTypes.func,
    allNotifications: React.PropTypes.array,

    // search stuff that needs to be bubbled up
    //searchQuery: React.PropTypes.string,
    //searching: React.PropTypes.bool,
    onQueryChange: React.PropTypes.func,
    //clearSearch: React.PropTypes.func
  },

  getInitialState() {
    return {
      query: ''
    };
  },

  componentWillReceiveProps(nextProps) {
  },

  componentDidMount() {

  },
  componentWillUnmount() {

  },

  toggleSidebar(ev) {
    ev.preventDefault();
    this.props.toggleSidebar();
  },

  toggleLeftNav() {
    //this.props.leftNavActions.toggle();
    AppActions.openSidebar('home');
  },

  clearSearch() {
    this.setState({ query: '' });
    this.props.clearSearch();
  },

  onQueryChange(ev) {
    ev.preventDefault();
    var query = this.refs.search.getValue();
    this.setState({ query: query })
    //this.props.onQueryChange(query);
    // reset the timeout if it already exists
    if(this.searchTimeout != undefined) {
      clearTimeout(this.searchTimeout);
      delete this.searchTimeout;
    }
    // make searching smoother with a bit of lag
    this.searchTimeout = setTimeout(() => { this.search(query) }, 300);
  },

  search(queryArg) {
    var bevy_id = this.props.activeBevy._id;
    var board_id = this.props.activeBoard._id;
    var query = this.state.query;

    if(!_.isEmpty(queryArg)) query = queryArg;

    PostActions.search(query, bevy_id, board_id);
    this.props.onQueryChange(query);
  },

  renderClearSearchButton() {
    if(this.state.query.length <= 0) return <div />;
    return (
      <button
        className='clear-search'
        title='Clear Search'
        onClick={ this.clearSearch }
      >
        <i className='material-icons'>close</i>
      </button>
    );
  },

  renderInfoIcon() {
    if(this.props.sidebarOpen) {
      return <i className="material-icons">info</i>;
    } else {
      return <i className="material-icons">info_outline</i>;
    }
  },

  render() {
    return (
      <div className='board-navbar'>
        <div className='left'>
          <div className='title'>
            { (this.props.activeBoard._id == undefined)
                ? 'Home Feed' : this.props.activeBoard.name }
          </div>
        </div>
        <div className='right'>
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
          <button
            className='info-button'
            title={ (this.props.sidebarOpen)
              ? 'Close Board Info' : 'Open Board Info' }
            onClick={ this.toggleSidebar }
          >
            { this.renderInfoIcon() }
          </button>
        </div>
      </div>
    );
  }
});

module.exports = BoardNavbar;
