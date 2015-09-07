/**
 * SubBevyPanel.jsx
 *
 * List of bevies
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var Ink = require('react-ink');
var {
  Button,
  ButtonGroup,
  Input,
  Tooltip,
  OverlayTrigger
} = require('react-bootstrap');
var {
  FontIcon,
  TextField,
  Checkbox,
  IconButton
} = require('material-ui');

var TagItem = require('./TagItem.jsx');

var _ = require('underscore');
var router = require('./../../router');
var BevyActions = require('./../BevyActions');

var SubBevyPanel = React.createClass({

  propTypes: {
    myBevies: React.PropTypes.array.isRequired,
    activeBevy: React.PropTypes.object.isRequired,
    activeTags: React.PropTypes.array,
    allBevies: React.PropTypes.array
  },

  getInitialState() {
    var tags = this.props.activeBevy.tags;

    var usedColors = _.pluck(tags, 'color');
    var colors = ['#F44336','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#00BCD4', '#009688', '#4CAF50', '#8BC34A','#CDDC39','#FFEB3B','#FFC107','#FF9800','#FF5722'];
    colors = _.reject(colors, 
      function(color) { 
        return _.find(usedColors, function(usedColor){ return usedColor == color}) != undefined; 
    });

    return {
      newTag: false,
      newTagValue: '',
      colorPicker: false,
      newTagColor: colors[0],
      activeTags: this.props.activeTags,
      editing: false
    };
  },

  componentWillRecieveProps(nextProps) {
    this.setState({
      activeTags: nextProps.activeTags
    });
  },

  handleChange() {
    this.setState({newTagValue: this.refs.newTagInput.getValue()})
  },

  submitTag() {
    var newTagValue = this.state.newTagValue;
    var newTagColor = this.state.newTagColor;
    var tag = {name: newTagValue, color: newTagColor};
    if(_.contains(_.pluck(this.props.activeBevy.tags, 'name'), newTagValue)) {
      this.refs.newTagInput.setErrorText('that tag already exists');
      return;
    }
    if(newTagValue == '') {
      this.refs.newTagInput.setErrorText('please enter a name');
      return;
    }
    if(_.contains(_.pluck(this.props.activeBevy.tags, 'color'), newTagColor)) {
      this.refs.newTagInput.setErrorText('that color already exists');
      return;
    }
    this.setState({
      newTag: false,
      newTagValue: '',
      colorPicker: false
    });
    var tags = this.props.activeBevy.tags;
    tags.push(tag)

    BevyActions.updateTags(tags);
    BevyActions.update(this.props.activeBevy._id, null, null, null, tags);
  },

  render() {
    var bevy = this.props.activeBevy;
    var tags = bevy.tags;
    var activeTags = this.state.activeTags;

    var tagButtons = [];
    for(var key in tags) {
      var tag = tags[key];
      var tagItem = (
        <TagItem 
          key={ 'tagitem:' + tag.name }
          editing={this.state.editing}
          tag={ tag }
          tags={ tags }
          activeBevy={this.props.activeBevy}
          activeTags={this.props.activeTags}
        />
      );

      tagButtons.push(tagItem);
    }

    var usedColors = _.pluck(tags, 'color');
    var colors = ['#F44336','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#00BCD4', '#009688', '#4CAF50', '#8BC34A','#CDDC39','#FFEB3B','#FFC107','#FF9800','#FF5722'];
    colors = _.reject(colors, 
      function(color) { 
        return _.find(usedColors, function(usedColor){ return usedColor == color}) != undefined; 
    });
    var colorButtons = [];
    for(var key in colors) {
      var color = colors[key];
      colorButtons.push(<Button className='color' style={{backgroundColor: color}} id={color} onClick={(ev) => { this.setState({newTagColor: ev.target.getAttribute('id'), colorPicker: false}); }} />)
    }

    var colorPicker = (this.state.colorPicker)
    ? (<div>
        <div className='panel color-picker-modal' >
          {colorButtons}
        </div>
        <div className='modal-backdrop' onClick={() => { this.setState({colorPicker: false}); }}/>
      </div>)
    : (<div className='color-picker-modal'/>)

    if(this.state.newTag) {
      tagButtons.push(
        <div className='new-tag' key='new-tag'> 
          <div className='color-picker'>
            { colorPicker }
            <Button className='color-btn' style={{backgroundColor: this.state.newTagColor}} onClick={() => { this.setState({colorPicker: !this.state.colorPicker}); }}/>
          </div>
          <TextField 
            hintText="new tag" 
            onEnterKeyDown={this.submitTag}
            ref='newTagInput'
            value={this.state.newTagValue} 
            onChange={this.handleChange} 
            onFocus={() => { this.setState({colorPicker: false}); }}
            style={{width: '75%'}}
          />
          <Button onClick={this.submitTag} className='simple-btn glyphicon glyphicon-ok'/>
        </div> 
      );
    }

    var createGlyph = (this.state.editing) ? "glyphicon glyphicon-ok" : "glyphicon glyphicon-pencil";
    var editGlyph = (this.state.newTag) ? 'glyphicon glyphicon-remove' : "glyphicon glyphicon-plus";

    var editTip = (this.state.editing) ? <Tooltip>Done</Tooltip> : <Tooltip>Remove Tags</Tooltip>;
    var createTip = (this.state.newTag) ? <Tooltip>Cancel</Tooltip> : <Tooltip>Create New Tag</Tooltip>;

    var editButton = <div className='glyphicon' style={{width: '38px', height: '20px'}}/>;
    if(_.findWhere(bevy.admins, { _id: window.bootstrap.user._id }) != undefined)
    editButton = (
      <OverlayTrigger placement='bottom' overlay={editTip}>
        <Button 
          className='edit-btn'
          disabled={this.state.newTag}
          onClick={() => { this.setState({ editing: !this.state.editing, newTag: false }); }}>
          <span className={createGlyph}/>
        </Button>
      </OverlayTrigger>
    );

    var createButton = <div/>;
    if(_.findWhere(bevy.admins, { _id: window.bootstrap.user._id }) != undefined) {
      var createButton = (
      <OverlayTrigger placement='bottom' overlay={createTip}>
        <Button 
          className='create-btn'
          disabled={this.state.editing} 
          onClick={() => { this.setState({ newTag: !this.state.newTag }); }}>
          <span className={editGlyph}/>
        </Button>
      </OverlayTrigger>
      );
    }


    return (
      <div className='tag-panel panel'>
        <div className='panel-header'>
          <span className='title'>Tags</span>
          <div className='actions'>
            { createButton }
            { editButton }
          </div>
        </div>
        <ButtonGroup className='tag-btns' role="group">
          { tagButtons }
        </ButtonGroup>
      </div>
    );
  }

});

module.exports = SubBevyPanel;
