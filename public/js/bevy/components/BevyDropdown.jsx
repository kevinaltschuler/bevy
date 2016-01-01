/**
 * BevyDropdown.jsx
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var {
  MenuItem,
  DropdownButton,
  Button,
  Overlay
} = require('react-bootstrap');
var Ink = require('react-ink');
var BevyDropdownItem = require('./BevyDropdownItem.jsx');
var CreateNewBevyModal = require('./CreateNewBevyModal.jsx');

var _ = require('underscore');
var user = window.bootstrap.user;

var BevyDropdown = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      show: false,
      showNewBevyModal: false
    };
  },

  componentDidMount() {
    this.container = ReactDOM.findDOMNode(this.refs.Container);
  },

  toggle() {
    this.setState({
      show: !this.state.show
    });
  },

  openCreateModal(ev) {
    ev.preventDefault();
    if(_.isEmpty(window.bootstrap.user)) return;
    this.setState({
      showNewBevyModal: true
    });
  },

  _renderCreateNewBevyButton() {
    if(_.isEmpty(window.bootstrap.user)) return <div />;
    return (
      <a
        className='create-new-btn'
        href='#'
        onClick={ this.openCreateModal }
      >
        Create New Bevy
      </a>
    );
  },

  render() {
    var myBevies = this.props.myBevies;
    var bevies = [];

    for(var key in myBevies) {
      var bevy = myBevies[key];
      bevies.push(
        <BevyDropdownItem
          key={ 'bevydropdown:' + bevy._id }
          bevy={ bevy }
          active={ bevy._id == this.props.activeBevy._id }
        />
      );
    }

    if(_.isEmpty(bevies)) {
      if(_.isEmpty(window.bootstrap.user)) {
        bevies = (
          <span className='no-bevies'>Please Log In To Subscribe to Bevies</span>
        );
      } else {
        bevies = (
          <span className='no-bevies'>No Added Bevies :(</span>
        );
      }
    }

    return (
      <div ref='Container' style={{ position: 'relative' }}>
        <Button
          ref='BevyButton'
          className='my-bevies-btn'
          onClick={ this.toggle } >
          Bevies
          <Ink />
        </Button>
        <Overlay
          show={ this.state.show }
          target={(props) => ReactDOM.findDOMNode(this.refs.BevyButton) }
          placement='bottom'
          container={ this.container }
        >
          <div className='bevy-dropdown-container'>
            <div className='backdrop' onClick={ this.toggle } />
            <div className='arrow' />
            <div ref='BevyList' className='bevy-dropdown' onWheel={(ev) => {
              ev.preventDefault();
              // manual scroll code so that this event doesnt bubble up to other containers
              this.node = ReactDOM.findDOMNode(this.refs.BevyList);
              var scrollTop = this.node.scrollTop;
              if(ev.deltaY > 0) {
                scrollTop += 50;
              } else {
                scrollTop -= 50;
              }
              if(scrollTop < 0) scrollTop = 0;
              if(scrollTop > (this.node.scrollHeight - this.node.offsetHeight))
                scrollTop = this.node.scrollHeight - this.node.offsetHeight;
              this.node.scrollTop = scrollTop;
            }}>
              <div className='bevy-dropdown-header'>
                <a className='view-all-btn' href='/s/'>All Bevies</a>
                { this._renderCreateNewBevyButton() }
                <CreateNewBevyModal
                  show={ this.state.showNewBevyModal }
                  onHide={() => { this.setState({ showNewBevyModal: false }) }}
                />
              </div>
              { bevies }
            </div>
          </div>
        </Overlay>
      </div>
    );
  }
});

module.exports = BevyDropdown;
