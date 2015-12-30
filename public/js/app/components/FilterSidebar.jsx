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
  FontIcon,
  FlatButton,
  TextField,
  IconButton
} = require('material-ui');

var CreateNewBevyModal = require('./../../bevy/components/CreateNewBevyModal.jsx');

var FilterSidebar = React.createClass({
  propTypes: {
    searchQuery: React.PropTypes.string
  },

  getInitialState() {
    return {
      filter: 'top',
      showNewBevyModal: false,
      selectedIndex: 4
    };
  },

  componentDidMount() {
    BevyActions.search(router.search_query);
    BevyActions.filterBevies('Most Subscribers');
  },


  handleFilter(filter) {
    var selectedIndex = 0;
    switch(filter) {
      case 'ABC':
        selectedIndex = 0;
        break;
      case 'ZYX':
        selectedIndex = 1;
        break;
      case 'Newest':
        selectedIndex = 2;
        break;
      case 'Oldest':
        selectedIndex = 3;
        break;
      case 'Most Subscribers':
        selectedIndex = 4;
        break;
      case 'Least Subscribers':
        selectedIndex = 5;
        break;
    };

    this.setState({
      selectedIndex: selectedIndex
    });

    BevyActions.filterBevies(filter);
  },

  onSearch() {
    router.navigate('/s/' + this.refs.search.getValue(), { trigger: true });
  },

  onFilterChange(ev, selectedIndex, menuItem) {
    ev.preventDefault();
    var filter = ev.target.textContent;
    this.handleFilter(filter);
  },

  onKeyUp(ev) {
    ev.preventDefault();
    if(ev.which == 13) {
      // trigger search
      BevyActions.search(this.refs.search.getValue());
      router.navigate('/s/' + this.refs.search.getValue(), { trigger: true });
    }
  },

  onChange(ev) {
    ev.preventDefault();
    this.setState({
      searching: true
    });
    if(this.searchTimeout != undefined) {
      clearTimeout(this.searchTimeout);
      delete this.searchTimeout;
    }
    this.searchTimeout = setTimeout(this.onSearch, 500);
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
      {payload: '4', text: 'Most Subscribers'},
      {payload: '5', text: 'Least Subscribers'}
    ];

    var searchTitle = ( 
      <div style={{display: 'flex', flexDirection: 'row', marginTop: -15}}>  
        <IconButton
          iconClassName='glyphicon glyphicon-search'
          style={{ width: '20px', height: '20px', padding: '5px', marginTop: '15px', marginLeft: -10, marginRight: 10 }}
          iconStyle={{ color: '#666', fontSize: '14px' }}
          title='Search'
        />      
        <TextField
          type='text'
          style={{width: '130px'}}
          ref='search'
          onChange={ this.onChange }
          onKeyUp={ this.onKeyUp }
          defaultValue={ router.search_query || '' }
        />
      </div>
    )

    var bevyContent = (
      <div className='actions'>
        <span className='search-title'>
          { searchTitle }
        </span>
        <div className='action sort'>
          <div className='action-name'>
            Filter
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
          <FlatButton 
            disabled={_.isEmpty(window.bootstrap.user)} 
            label='new bevy'
            onClick={() => { this.setState({ showNewBevyModal: true }); }}
            style={{width: '100%', marginBottom: 10}}
            labelStyle={{marginRight: -10}}
          >
            <i className='material-icons' style={{position: 'absolute', top: '5px', left: '30px', color: '#666'}}>add</i>
          </FlatButton>
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
