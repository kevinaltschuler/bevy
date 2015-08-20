/**
 * CreateNewBevy.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var Panel = rbs.Panel;
var Input = rbs.Input;
var Button = rbs.Button;
var Modal = rbs.Modal;

var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;

var BevyActions = require('./../BevyActions');
var BevyStore = require('./../BevyStore');
var Uploader = require('./../../shared/components/Uploader.jsx');

var user = window.bootstrap.user;

var cobevyModal = React.createClass({

  propTypes: {
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func,
    publicBevies: React.PropTypes.array.isRequired,
    myBevies: React.PropTypes.array,
    allBevies: React.PropTypes.array
  },

  getInitialState() {
    return {
      showNewBevyModal: false,
      searching: false,
      searchList: [],
      query: ''
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

  render: function() {
    var publicBevies = this.props.publicBevies;
    var myBevies = this.props.myBevies;

    var searchList = this.state.searchList;
    var searchQuery = this.state.searchQuery;

    var bevies = publicBevies;
    if(!_.isEmpty(searchQuery)) {
      bevies = searchList;
    }

    var bevyButtons = [];

    for(var key in bevies) {
      var bevy = bevies[key];
      bevyButtons.push(
        <Button>
         bevy.name
        </Button>
      );
    };

    var content = <div className='panel-list'>
        {bevyButtons}
      </div>;

    if(_.isEmpty(bevyButtons)) {
      content = <h2> no results :( </h2>
    }

    if(this.props.searching) {
      content = <section className="loaders"><span className="loader loader-quart"> </span></section>
    }

    return (
      <Modal show={ this.props.show } onHide={ this.props.onHide } className="create-bevy">
        <Modal.Header closeButton>
          <TextField 
            type='text'
            className='search-input'
            ref='search'
            value={ this.state.query }
            onChange={ this.onChange }
            hintText='Search Bevies'
          />
          <span className='glyphicon glyphicon-search'/>
        </Modal.Header>
        <Modal.Body className="bevy-info">
          { content }
        </Modal.Body>
        <Modal.Footer className="panel-bottom">
        </Modal.Footer>
      </Modal>
    );
  }
});

module.exports = cobevyModal;
