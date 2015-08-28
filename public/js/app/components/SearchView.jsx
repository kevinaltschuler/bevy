/**
 * SearchView.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var CTG = React.addons.CSSTransitionGroup;
var constants = require('./../../constants');
var router = require('./../../router');

var user = window.bootstrap.user;

var {
  Button
} = require('react-bootstrap');
var {
  RaisedButton,
  FontIcon
} = require('material-ui');

var PublicBevyPanel = require('./../../bevy/components/PublicBevyPanel.jsx');
var CreateNewBevyModal = require('./../../bevy/components/CreateNewBevyModal.jsx');
var FilterSidebar = require('./FilterSidebar.jsx');

var constants = require('./../../constants');
var BEVY = constants.BEVY;
var BevyStore = require('./../../bevy/BevyStore');

var SearchView = React.createClass({

  propTypes: {
    publicBevies: React.PropTypes.array.isRequired,
    myBevies: React.PropTypes.array
  },

  getInitialState() {
    return {
      showNewBevyModal: false,
      searching: false,
      searchList: []
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.SEARCHING, this.handleSearching);
    BevyStore.on(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.SEARCHING, this.handleSearching);
    BevyStore.off(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
  },

  handleSearching() {
    this.setState({
      searching: true,
      searchQuery: BevyStore.getSearchQuery(),
      searchList: []
    });
  },

  handleSearchComplete() {
    this.setState({
      searching: false,
      searchList: BevyStore.getSearchList()
    });
  },

  render() {
    var publicBevies = this.props.publicBevies;
    var myBevies = this.props.myBevies;

    var searchList = this.state.searchList;
    var searchQuery = this.state.searchQuery;

    var bevies = publicBevies;
    if(!_.isEmpty(searchQuery)) {
      bevies = searchList;
    }

    var publicBevyPanels = [];

    for(var key in bevies) {
      var bevy = bevies[key];
      publicBevyPanels.push(
        <PublicBevyPanel bevy={ bevy } myBevies={ this.props.myBevies } key={ Math.random() } />
      );
    };

    var content = <div className='panel-list'>
        {publicBevyPanels}
      </div>;

    if(_.isEmpty(publicBevyPanels) && !_.isEmpty(this.state.searchQuery)) {
      console.log(this.state.searchQuery);
      content = <h2> no results :( </h2>
    }

    if(this.props.searching) {
      content = <section className="loaders"><span className="loader loader-quart"> </span></section>
    }


    return (
      <div className='public-bevy-wrapper'>
        <div className='mid-section'>
          <div className='left-filter-sidebar'>
            <div className='filter-fixed'>
              <FilterSidebar searchQuery={ this.props.searchQuery } />
            </div>
          </div>
          <div className='public-bevy-list'>
            { content }
          </div>
        </div>
      <div className="footer-public-bevies">
        <div className='footer-left'>
          Bevy © 2015 
        </div>
        <div className='footer-right'>
          <Button className="bevy-logo-btn" href='/'>
            <div className='bevy-logo-img' style={{ backgroundImage: 'url(/img/logo_100.png)' }}/>
          </Button>
        </div>
      </div>
    </div>
    );
  }
});

module.exports = SearchView;
