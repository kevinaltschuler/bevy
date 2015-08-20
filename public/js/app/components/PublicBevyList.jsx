/**
 * PublicBevyList.jsx
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

var PublicBevyList = React.createClass({

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

    if(this.props.searching) {
      content = <section className="loaders"><span className="loader loader-quart"> </span></section>
    }

    if(_.isEmpty(publicBevyPanels) && !this.props.searching) {
      content = <h2> no results :( </h2>
    }


    return (
      <div className='public-bevy-wrapper'>
        <div className='mid-section'>
          <div className='public-bevy-list'>
            {/*<div className='public-bevy-header'>
              <div className='title'>
                <Button className='title-btn'>
                  <h2>my bevies</h2>
                </Button>
                <h2 className='divider'>&nbsp;•&nbsp;</h2>
                <Button className='title-btn'>
                  <h2>all bevies</h2>
                </Button>
              </div>
              <RaisedButton 
                disabled={_.isEmpty(window.bootstrap.user)} 
                label='new bevy' 
                className='public-bevy-panel panel'
                onClick={() => { this.setState({ showNewBevyModal: true }); }}>
                <FontIcon className="glyphicon glyphicon-plus"/>
              </RaisedButton>
              <CreateNewBevyModal
                show={ this.state.showNewBevyModal }
                onHide={() => { this.setState({ showNewBevyModal: false }); }}
              />
            </div>*/}
            { content }
          </div>
          <FilterSidebar searchQuery={ this.props.searchQuery } />
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

module.exports = PublicBevyList;
