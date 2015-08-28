/**
 * BevyDropdown.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var Ink = require('react-ink');

var {
  MenuItem,
  DropdownButton,
  Button,
  Overlay
} = require('react-bootstrap');

var BevyDropdownItem = require('./BevyDropdownItem.jsx');

var user = window.bootstrap.user;

var BevyDropdown = React.createClass({

  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      show: false
    };
  },

  componentDidMount() {
    this.container = React.findDOMNode(this.refs.Container);
  },

  toggle() {
    this.setState({
      show: !this.state.show
    });
  },

  render() {
    if (_.isEmpty(window.bootstrap.user)) return (
      <Button href='/bevies' className='bevies-dropdown'>
        Bevies
      </Button>
    );

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

    return (
      <div ref='Container' style={{ position: 'relative' }}>
        <Button
          ref='BevyButton'
          className='my-bevies-btn'
          onClick={ this.toggle }
        >
          My Bevies
          <Ink style={{paddingLeft: '15px'}}/>
        </Button>
        <Overlay
          show={ this.state.show }
          target={(props) => React.findDOMNode(this.refs.BevyButton) }
          placement='bottom'
          container={ this.container }
        >
          <div className='bevy-dropdown-container'>
            <div className='backdrop' onClick={ this.toggle } />
            <div className='arrow' />
            <div className='bevy-dropdown'>
              { bevies }
            </div>
          </div>
        </Overlay>
      </div>
    );
  }
});

module.exports = BevyDropdown;