/**
 * TagItem.jsx
 *
 * MudBoyPlex NOOOOOOOO!!!
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

var CobevyModal = require('./CobevyModal.jsx');

var BevyActions = require('./../BevyActions');

var TagItem = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    activeTags: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    editing: React.PropTypes.bool
  },

  getInitialState(){
    return {
      name: this.props.tag.name,
      color: this.props.tag.color
    }
  },

  handleCheck(ev, checked) {
    var activeTags = this.props.activeTags;
    var tag = { name: this.state.name, color: this.state.color };

    if(_.find(activeTags, function($tag) { return tag.name == $tag.name }) == undefined) {
      activeTags.push(tag);
    }
    else {
      activeTags = _.reject(activeTags, function($tag) { return tag.name == $tag.name });
    }

    BevyActions.updateTags(activeTags);
  },

  removeTag(ev) {
    ev.preventDefault();
    var tags = this.props.activeBevy.tags;
    var tag = {name: this.state.name, color: this.state.color};

    var tags = _.reject(this.props.activeBevy.tags, function($tag) { return $tag.name == tag.name });

    BevyActions.update(this.props.activeBevy._id, null, null, null, tags);
    BevyActions.updateTags(tags);
  },

  render() {
    var tag = this.props.tag;
    var tagName = tag.name;
    var tagColor = tag.color;

    var tagItem = (this.props.editing) ? (
      <div className='tag-remove-btn'>
        <a
          href='' 
          onClick={this.removeTag} 
          className='glyphicon glyphicon-remove'
        />
        {tagName}
     </div>
    ) : (
      <Checkbox 
        name={tagName} 
        label={tagName} 
        className='bevy-btn'
        style={{width: '100%', color: 'rgba(0,0,0,.6)'}}
        defaultChecked={true}
        iconStyle={{
          fill: tag.color
        }}
        onCheck={this.handleCheck}
       />
    );

    return (
      <div style={{width: '90%'}}>
        {tagItem}
      </div>
    );
  }
});

module.exports = TagItem;