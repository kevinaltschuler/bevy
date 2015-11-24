/**
 * BevySearchOverlay.jsx
 * @author kevin
 yay
 */

'use strict';

var React = require('react');
var {
  Button,
  Overlay
} = require('react-bootstrap');

var _ = require('underscore');
var BevyActions = require('./../../bevy/BevyActions');
var BevyStore = require('./../../bevy/BevyStore');
var constants = require('./../../constants');
var BEVY = constants.BEVY;

var BevySearchOverlay = React.createClass({

  propTypes: {
    container: React.PropTypes.any, // the DOM node the overlay is rendered in
    target: React.PropTypes.any, // the DOM node the overlay is relative to
    query: React.PropTypes.string, // the search query entered in by the parent
    addSibling: React.PropTypes.func, // callback thats called when a user is selected/added
    siblings: React.PropTypes.array //siblings that already exist
  },

  getDefaultProps() {
    return {
      addSibling: _.noop
    };
  },

  getInitialState() {
    return {
      show: false,
      bevies: [],
      selected: 0
    }
  },

  componentDidMount() {
    BevyStore.on(BEVY.SEARCHING, this.handleSearching);
    BevyStore.on(BEVY.SEARCH_COMPLETE, this.handleSearchResults);
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.SEARCHING, this.handleSearching);
    BevyStore.off(BEVY.SEARCH_COMPLETE, this.handleSearchResults);
  },

  componentWillReceiveProps(nextProps) {
    if(_.isEmpty(nextProps.query)) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
      BevyActions.search(nextProps.query);
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if(this.state.show && !nextState.show) {
      // about to hide
      document.removeEventListener('keydown', this.onKeyDown);
    }
    else if (!this.state.show && nextState.show) {
      // about to show
      document.addEventListener('keydown', this.onKeyDown);
    }
  },

  handleSearching() {
    // TODO: loading indicator?
  },

  handleSearchResults() {
    var bevies = BevyStore.getSearchList();
    // dont show users that have already been added to the list
    bevies = _.reject(bevies, function($bevy) {
      return _.contains(this.props.siblings, $bevy._id);
    }.bind(this));
    this.setState({
      bevies: bevies
    });
  },

  addSibling(ev) {
    var key = ev.target.getAttribute('id');
    //console.log(key);
    this.setState({
      show: false
    });
    this.props.addSibling(this.state.bevies[key]._id);
  },

  onItemMouseOver(ev) {
    var key = ev.target.getAttribute('id');
    this.setState({
      selected: key
    });
  },

  onKeyDown(ev) {
    switch(ev.which) {
      case 13: // enter
        // add the user and close the overlay
        this.props.addSibling(this.state.bevies[this.state.selected]._id);
        break;
      case 38: // up arrow
        // select one above
        var index = this.state.selected;
        index--;
        this.setState({
          selected: (index == -1) ? this.state.bevies.length - 1 : index
        });
        break;
      case 40: // down arrow
        // select one below
        var index = this.state.selected;
        index++;
        this.setState({
          selected: (index == this.state.bevies.length) ? 0 : index
        });
        break;
    }
    return;
  },

  render() {

    var bevies = [];
    for(var key in this.state.bevies) {
      var bevy = this.state.bevies[key];

      var image_url = (_.isEmpty(bevy.image))
        ? '/img/default_group_img.png'
        : constants.apiurl + bevy.image.path;
      var name = bevy.name;
      var imageStyle = {
        backgroundImage: 'url(' + image_url + ')',
        backgroundSize: 'auto 100%',
        backgroundPosition: 'center'
      };

      bevies.push(
        <Button  
          key={ 'bevysearchoverlay:bevy:' + bevy._id } 
          id={ key } 
          className={ 'user-item' + ((this.state.selected == key) 
            ? ' active' 
            : '') 
          }
          onClick={ this.addSibling }
          onMouseOver={ this.onItemMouseOver }
        >
          <div className='image' id={ key } style={ imageStyle }/>
          <div className='details' id={ key }>
            <span className='name' id={ key }>
              { name }
            </span>
          </div>
        </Button>
      );
    }

    return (
      <Overlay
        show={ this.state.show }
        target={ this.props.target }
        placement='bottom'
        container={ this.props.container }
      >
        <div 
          style={{
            marginLeft: '30px',
            marginTop: '-10px'
          }} 
          className='user-search-overlay'
        >
          { bevies }
        </div>
      </Overlay>
    );
  }
});

module.exports = BevySearchOverlay;