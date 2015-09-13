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
var Ink = require('react-ink');
var {
  Button,
  ButtonGroup,
  Input,
  OverlayTrigger,
  Tooltip
} = require('react-bootstrap');
var {
  FontIcon,
  TextField,
  Checkbox,
  IconButton
} = require('material-ui');
var CobevyModal = require('./CobevyModal.jsx');

var _ = require('underscore');
var router = require('./../../router');
var BevyActions = require('./../BevyActions');

var TagItem = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    tags: React.PropTypes.array,
    activeTags: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    editing: React.PropTypes.bool
  },

  getInitialState(){
    return {
      name: this.props.tag.name,
      color: this.props.tag.color,
      checked: true
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      checked: (_.findWhere(nextProps.activeTags, { name: this.state.name }) != undefined)
    });
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

    this.setState({
      checked: !this.state.checked
    });
  },

  removeTag(ev) {
    ev.preventDefault();
    var tags = this.props.activeBevy.tags;
    if(tags.length == 1) return;
    var tag = {name: this.state.name, color: this.state.color};

    var tags = _.reject(this.props.activeBevy.tags, function($tag) { return $tag.name == tag.name });

    BevyActions.update(this.props.activeBevy._id, null, null, null, tags);
    BevyActions.updateTags(tags);
  },

  render() {
    var tag = this.props.tag;
    var tagName = tag.name;
    var tagColor = tag.color;

    var removeButton = (this.props.activeBevy.tags.length <= 1)
    ? (
      <OverlayTrigger placement='right' overlay={ <Tooltip>Can't Remove a Bevy's Last Tag!</Tooltip> }>
        <span className='glyphicon glyphicon-remove disabled' />
      </OverlayTrigger>
    ) : (
      <OverlayTrigger placement='left' overlay={ <Tooltip>Remove Tag "{ this.state.name }"</Tooltip> }>
        <a href='#' onClick={ this.removeTag } className='glyphicon glyphicon-remove' />
      </OverlayTrigger>
    );

    var tagItem = (this.props.editing) ? (
      <div className='tag-remove-btn'>
        { removeButton }
        { tagName }
     </div>
    ) : (
      <OverlayTrigger placement='right' overlay={ 
        (this.state.checked) ? <Tooltip>Hide Posts Tagged { this.state.name }</Tooltip> : <Tooltip>Show Posts Tagged { this.state.name }</Tooltip> 
      }>
        <Checkbox 
          name={tagName} 
          label={tagName} 
          className='tag-item'
          style={{ width: 'auto', color: 'rgba(0,0,0,.6)', paddingRight: 8 }}
          defaultChecked={ this.state.checked }
          checked={ this.state.checked }
          iconStyle={{
            fill: tag.color
          }}
          onCheck={this.handleCheck}
         />
      </OverlayTrigger>
    );

    return tagItem;
  }
});

module.exports = TagItem;