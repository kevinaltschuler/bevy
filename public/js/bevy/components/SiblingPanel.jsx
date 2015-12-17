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
var Ink = require('react-ink');
var rbs = require('react-bootstrap');
var {
  Button,
  ButtonGroup,
  Input,
  Tooltip,
  OverlayTrigger
} = rbs;
var mui = require('material-ui');
var {
  FontIcon,
  TextField,
  Checkbox,
  IconButton,
  FlatButton
} = mui;
var BevySearchOverlay = require('./BevySearchOverlay.jsx');
var SiblingItem = require('./SiblingItem.jsx');

var _ = require('underscore');
var router = require('./../../router');
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
    this.setState({
      query: ''
    });
    BevyActions.update(this.props.activeBevy._id, null, null, null, null, siblings);
  },

  onAddSiblingChange(ev) {
    ev.preventDefault();
    if(this.addSiblingTimeout != undefined) {
      clearTimeout(this.addSiblingTimeout);
      delete this.addSiblingTimeout;
    }
    this.addSiblingTimeout = setTimeout(() => {
      var query = this.refs.AddSiblingInput.getValue();
      this.setState({
        query: query
      });
    }, 500);
  },

  render() {
    var bevy = this.props.activeBevy;
    var siblings = bevy.siblings;

    var createGlyph = (this.state.editing) ? "glyphicon glyphicon-ok" : "glyphicon glyphicon-pencil";
    var editGlyph = (this.state.adding) ? 'glyphicon glyphicon-remove' : "glyphicon glyphicon-plus";
    var editTip = <Tooltip>Edit</Tooltip>;
    var createTip = (this.state.adding) ? <Tooltip>Cancel</Tooltip> : <Tooltip>Add</Tooltip>;

    var editButton = <div className='glyphicon' style={{width: '38px', height: '20px'}}/>;
    if(_.findWhere(bevy.admins, { _id: window.bootstrap.user._id }) != undefined) {
      editButton = (
        <OverlayTrigger placement='bottom' overlay={ editTip }>
          <Button
            className='edit-btn'
            disabled={this.state.adding}
            onClick={() => { this.setState({ editing: !this.state.editing }); }}
          >
            <span className={createGlyph}/>
          </Button>
        </OverlayTrigger>
      );
    }

    var createButton = <div className='glyphicon' style={{width: '38px', height: '20px'}}/>;
    if(_.findWhere(bevy.admins, { _id: window.bootstrap.user._id }) != undefined) {
      createButton = (
      <OverlayTrigger placement='bottom' overlay={ createTip }>
        <Button
          className='create-btn'
          disabled={this.state.editing}
          onClick={() => { this.setState({ adding: !this.state.adding }); }}
        >
          <span className={editGlyph}/>
        </Button>
      </OverlayTrigger>
      );
    }

    var siblingButtons = [];
    for(var key in siblings) {
      var sibling = siblings[key];
      var siblingItem = (
        <SiblingItem
          key={ 'SiblingItem:' + sibling._id }
          bevy={ sibling }
          activeBevy={ this.props.activeBevy }
          editing={ this.state.editing }
        />
      );
      if(!_.isEmpty(bevy.name))
        siblingButtons.push(siblingItem);
    }

    var searchDiv = (this.state.adding)
    ? (
      <div style={{display: 'flex', alignItems: 'center', height: '30px'}} ref='SearchContainer' key='searchDiv'>
        <span className='glyphicon glyphicon-search' style={{padding: '6px 12px'}} ref='SearchIcon'/>
        <TextField
          type='text'
          ref='AddSiblingInput'
          onChange={ this.onAddSiblingChange }
          style={{width: '90%'}}
          groupClassName='participant-input'
        />
        <BevySearchOverlay
          container={this.refs.SiblingButtons}
          target={() => React.findDOMNode(this.refs.AddSiblingInput)}
          query={ this.state.query }
          addSibling={ this.addSibling }
          siblings={siblings}
        />
      </div>)
    : <div/>;

    if(this.state.adding) {
      siblingButtons.push(searchDiv)
    }
    if((_.findWhere(bevy.admins, { _id: window.bootstrap.user._id }) == undefined) && siblingButtons.length == 0) {
      return <div/>;
    }

    return (
      <div className='sibling-panel panel'>
        <div className='panel-header'>
          <span className='title'>
            Related Bevies
          </span>
          <div className='actions'>
            { createButton }
            { editButton }
          </div>
        </div>
        <ButtonGroup className='sibling-btns' role="group" ref='SiblingButtons'>
          {siblingButtons}
        </ButtonGroup>
      </div>
    );
  }

});

module.exports = SiblingPanel;
