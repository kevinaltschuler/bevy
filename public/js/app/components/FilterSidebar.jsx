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
    searchQuery: React.PropTypes.string
  },

  getInitialState() {
    return {
      filter: 'top',
      showNewBevyModal: false
    };
  },

  componentDidMount() {
    BevyActions.filterBevies('abc');
  },


  handleFilter(filter) {
    var selectedIndex = 0;
    switch(filter) {
      case 'abc':
        selectedIndex = 0;
        break;
      case 'zyx':
        selectedIndex = 1;
        break;
      case 'new':
        selectedIndex = 2;
        break;
      case 'old':
        selectedIndex = 3;
        break;
      case 'top':
        selectedIndex = 4;
        break;
      case 'bottom':
        selectedIndex = 5;
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
    var searchQuery = this.props.searchQuery;
    var selectedIndex = this.state.selectedIndex;

    var myClass = (this.state.collection == 'my') ? 'active' : '';
    var allClass = (this.state.collection == 'all') ? 'active' : '';

    var filterItems = [
      {payload: '0', text: 'ABC'},
      {payload: '1', text: 'ZYX'},
      {payload: '2', text: 'Newest'},
      {payload: '3', text: 'Oldest'},
      {payload: '4', text: 'Most subscribers'},
      {payload: '5', text: 'Least subscribers'}
    ];

    var searchTitle = (searchQuery == '' || _.isEmpty(searchQuery))
    ? 'All Bevies'
    : 'Searching for ' + "'" + searchQuery + "'";

    var bevyContent = (
      <div className='actions'>
        <span className='search-title'>
          { searchTitle }
        </span>
        <div className='action sort'>
          <div className='action-name'>
            Filter by
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
            labelPosition='after'
            onClick={() => { this.setState({ showNewBevyModal: true }); }}
            fullWidth={true}
            labelStyle={{marginRight: '-20px'}}
            style={{marginBottom: '10px', position: 'relative'}}
          >
            <FontIcon className='material-icons' style={{position: 'absolute', top: '5px', left: '35px', color: '#666'}}>add</FontIcon>
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
