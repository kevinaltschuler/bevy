/**
 * FilterSidebar.jsx
 * formerly money.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var router = require('./../../router');
var BevyActions = require('./../../bevy/BevyActions');
var BevyStore = require('./../../bevy/BevyStore');
var constants = require('./../../constants');
var BEVY = constants.BEVY;
var Footer = require('./Footer.jsx');

var {
  DropDownMenu,
  RaisedButton,
  FontIcon
} = require('material-ui');

var CreateNewBevyModal = require('./../../bevy/components/CreateNewBevyModal.jsx');

var FilterSidebar = React.createClass({
  propTypes: {
  },

  getInitialState() {
    return {
      filter: 'top',
      showNewBevyModal: false,
      searchQuery: ''
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.SEARCHING, this.handleSearching);
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.SEARCHING, this.handleSearching);
  },

  handleSearching() {
    this.setState({
      searchQuery: BevyStore.getSearchQuery()
    });
  },

  handleFilter(filter) {
    var selectedIndex = 0;
    switch(filter) {
      case 'top':
        selectedIndex = 0;
        break;
      case 'bottom':
        selectedIndex = 1;
        break;
      case 'new':
        selectedIndex = 2;
        break;
      case 'old':
        selectedIndex = 3;
        break;
    };

    this.setState({
      selectedIndex: selectedIndex
    });

    BevyActions.filterBevies(filter);
  },

  onFilterChange(ev, selectedIndex, menuItem) {
    ev.preventDefault();
    var filter = ev.target.textContent;
    this.handleFilter(filter);
  },

  render() {
    var searchQuery = this.state.searchQuery;
    var selectedIndex = this.state.selectedIndex;

    var myClass = (this.state.collection == 'my') ? 'active' : '';
    var allClass = (this.state.collection == 'all') ? 'active' : '';

    var filterItems = [
      {payload: '0', text: 'top'},
      {payload: '1', text: 'bottom'},
      {payload: '2', text: 'new'},
      {payload: '3', text: 'old'}
    ];

    var searchTitle = (searchQuery == '' || _.isEmpty(searchQuery))
    ? 'All Bevies'
    : 'Searching for ' + "'" + searchQuery + "'";

    var bevyContent = (
      <div className='actions'>
        <div className='action'>
          {searchTitle}
        </div>
        <div className='action sort'>
          <div className='action-name'>
            filter by
          </div> 
          <DropDownMenu 
            menuItems={ filterItems }
            selectedIndex={ selectedIndex }
            onChange={ this.onFilterChange }
          />
        </div>
        <div className='action new'>
          <CreateNewBevyModal 
            show={ this.state.showNewBevyModal } 
            onHide={() => { this.setState({ showNewBevyModal: false }) }}
          />
          <RaisedButton 
            disabled={_.isEmpty(window.bootstrap.user)} 
            label='new bevy'
            onClick={() => { this.setState({ showNewBevyModal: true }); }}
            fullWidth={true}
            style={{marginBottom: '10px', display: 'flex'}}
          >
            <span style={{fontSize: '13px', color: 'rgba(0,0,0,.7)'}} className="glyphicon glyphicon-plus"/>
          </RaisedButton>
        </div>
      </div>
    );
    return (
      <div className="filter-sidebar panel">
        { bevyContent }
      </div>
    );
  }
});

module.exports = FilterSidebar;
