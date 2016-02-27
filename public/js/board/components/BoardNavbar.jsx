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

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');

var BoardNavbar = React.createClass({
  propTypes: {
    activeBoard: React.PropTypes.object,
    sidebarOpen: React.PropTypes.bool,

    // search stuff that needs to be bubbled up
    searchQuery: React.PropTypes.string,
    searching: React.PropTypes.bool,
    onQueryChange: React.PropTypes.func,
    clearSearch: React.PropTypes.func
  },

  getInitialState() {
    return {
    };
  },

  componentDidMount() {

  },
  componentWillUnmount() {

  },

  clearSearch() {
    this.props.clearSearch();
  },

  onQueryChange(ev) {
    ev.preventDefault();
    this.props.onQueryChange(this.refs.search.getValue());
  },

  renderClearSearchButton() {
    if(this.props.searchQuery.length <= 0) return <div />;
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

  renderInfoIcon() {
    if(this.props.sidebarOpen) {
      return <i style={{color: '#2cb673'}} className="material-icons">info_outline</i>;
    } else {
      return <i className="material-icons">info_outline</i>;
    }
  },

  render() {
    return (
      <div className='board-navbar'>
        <div className='left'>
          <div className='title'>
            { this.props.activeBoard.name }
          </div>
          <Input
            ref='search'
            type='text'
            placeholder='Search'
            value={ this.props.searchQuery }
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
        <div className='right'>
          <button
            style={(this.props.sidebarOpen)
              ? { boxShadow: 'inset 0 1px 2px 0 rgba(0,0,0,.075)' }
              : {}}
            className='info-button'
            title={ (this.props.sidebarOpen)
              ? 'Close Board Info' : 'Open Board Info' }
            onClick={ this.props.toggleSidebar }
          >
            <Ink/>
            { this.renderInfoIcon() }
          </button>
        </div>
      </div>
    );
  }
});

module.exports = BoardNavbar;
