/**
 * SiblingPanel.jsx
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
var Ink = require('react-ink');

var router = require('./../../router');

var rbs = require('react-bootstrap');
var Button = rbs.Button;
var ButtonGroup = rbs.ButtonGroup;
var Input = rbs.Input;

var mui = require('material-ui');
var FontIcon = mui.FontIcon;
var TextField = mui.TextField;
var Checkbox = mui.Checkbox;
var IconButton = mui.IconButton;
var FlatButton = mui.FlatButton;

var BevySearchOverlay = require('./BevySearchOverlay.jsx');
var SiblingItem = require('./SiblingItem.jsx');

var BevyActions = require('./../BevyActions');
var BevyStore = require('./../BevyStore');

var SiblingPanel = React.createClass({

  propTypes: {
    myBevies: React.PropTypes.array.isRequired,
    activeBevy: React.PropTypes.object.isRequired,
    allbevies: React.PropTypes.array
  },

  getInitialState() {
    return {
      adding: false,
      editing: false,
      query: ''
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

  addSibling(sibling) {
    var siblings = this.props.activeBevy.siblings;
    siblings.push(sibling);
    _.uniq(siblings);
    console.log(siblings);
    BevyActions.update(this.props.activeBevy._id, null, null, null, null, siblings);
  },

  onAddSiblingChange(ev) {
    var query = this.refs.AddSibling.getValue();
    this.setState({
      query: query
    });
  },

  render() {
    var bevy = this.props.activeBevy;
    var siblings = bevy.siblings;

    var createGlyph = (this.state.editing) ? "glyphicon glyphicon-ok" : "glyphicon glyphicon-pencil";
    var editGlyph = (this.state.adding) ? 'glyphicon glyphicon-remove' : "glyphicon glyphicon-plus";

    var editButton = <div className='glyphicon' style={{width: '38px', height: '20px'}}/>;
    if((_.find(bevy.admins, function(admin) { return window.bootstrap.user._id == admin; })) ) {
      editButton = (
        <Button 
          className='new-bevy-btn'
          disabled={this.state.adding}
          onClick={() => { this.setState({ editing: !this.state.editing }); }}
        >
          <span className={createGlyph}/>
        </Button>
      );
    }

    var createButton = <div className='glyphicon' style={{width: '38px', height: '20px'}}/>;
    if(_.find(bevy.admins, function(admin) { return window.bootstrap.user._id == admin; })) {
      createButton = (
      <Button 
        className='new-bevy-btn'
        disabled={this.state.editing}
        onClick={() => { this.setState({ adding: !this.state.adding }); }}
      >
        <span className={editGlyph}/>
      </Button>
      );
    }

    var siblingButtons = [];
    for(var key in siblings) {
      var sibling = siblings[key];
      var bevy = BevyStore.getBevy(sibling);

      siblingButtons.push(
        <SiblingItem 
          bevy={ bevy }
          activeBevy={ this.props.activeBevy }
          editing={ this.state.editing } 
        />
      );
    }

    if(this.state.adding) {
      siblingButtons.push(
        <div style={{display: 'flex', alignItems: 'center', height: '30px'}}>
          <span className='glyphicon glyphicon-search' style={{padding: '6px 12px'}}/>
          <TextField 
            type='text'
            ref='AddSibling'
            value={ this.state.query }
            onChange={ this.onAddSiblingChange }
            style={{width: '90%'}}
          />
          <BevySearchOverlay
            container={() => React.findDOMNode(this.refs.searchContainer)}
            target={() => React.findDOMNode(this.refs.AddSibling)}
            query={ this.state.query }
            addSibling={ this.addSibling }
            siblings={siblings}
          />
        </div>
      )
    }


    return (
      <div className='bevy-list panel'>
        <div className='panel-header'>
          <div className='super-bevy-btn'>
            Related Bevies
          </div>
          <div className='actions'>
            { createButton }
            { editButton }
          </div>
        </div>
        <ButtonGroup className='bevy-list-btns' role="group">
          {siblingButtons}
        </ButtonGroup>
      </div>
    );
  }

});

module.exports = SiblingPanel;
