/**
 * SubBevyPanel.jsx
 *
 * List of bevies
 *
 * @author albert
 * @author kevin
 */

'use strict';

// imports
var React = require('react');
var _ = require('underscore');

var router = require('./../../router');

var rbs = require('react-bootstrap');
var Button = rbs.Button;
var ButtonGroup = rbs.ButtonGroup;

var BevyActions = require('./../BevyActions');

var SubBevyPanel = React.createClass({

  propTypes: {
    myBevies: React.PropTypes.array.isRequired,
    activeBevy: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
    };
  },

  switchBevy(ev) {
    ev.preventDefault();
    // get the bevy id
    var id = ev.target.getAttribute('id') || null;
    if(id == -1) id = 'frontpage';
    if(id == this.props.activeBevy._id) {
      router.navigate('/b/' + this.props.activeBevy._id, { trigger: true });
    } else {
      router.navigate('/b/' + this.props.activeBevy._id + '/' + id, { trigger: true });
    } 
  },

  render() {
    var bevy = this.props.activeBevy;

    var bevies = [];
    /*bevies.push(
      <Button
        key={ superBevy._id }
        id={ superBevy._id }
        type="button"
        className='bevy-btn'
        onClick={ this.switchBevy } >
        { superBevy.name }
      </Button>
    );*/
    /*for(var key in subBevies) {
      var bevy = subBevies[key];
      var className = 'bevy-btn';
      if(bevy._id == activeBevy.id) className += ' active';

        bevies.push(
          <Button
            key={ bevy._id }
            id={ bevy._id }
            type="button"
            className={ className }
            onClick={ this.switchBevy } >
            { bevy.name }
          </Button>
        );
    }*/

    /*var createButton = (_.isEmpty(window.bootstrap.user))
    ? <div/>
    : (
      <Button className='new-bevy-btn'>
        <FontIcon className="glyphicon glyphicon-plus"/>
      </Button>
    )*/


    return (
      <div className='bevy-list panel'>
        <div className='panel-header'>
          <div className='super-bevy-btn'>
            boards
          </div>
          {/** createButton **/}
        </div>
        <ButtonGroup className='bevy-list-btns' role="group">
          {bevies}
        </ButtonGroup>
      </div>
    );
  }

});

module.exports = SubBevyPanel;
