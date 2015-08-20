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
var Input = rbs.Input;

var mui = require('material-ui');
var FontIcon = mui.FontIcon;
var TextField = mui.TextField;
var Checkbox = mui.Checkbox;

var CobevyModal = require('./CobevyModal.jsx');

var BevyActions = require('./../BevyActions');

var SubBevyPanel = React.createClass({

  propTypes: {
    myBevies: React.PropTypes.array.isRequired,
    activeBevy: React.PropTypes.object.isRequired,
    activeTags: React.PropTypes.array,
    allbevies: React.PropTypes.array
  },

  getInitialState() {
    return {
      newTag: false,
      newTagValue: '',
      colorPicker: false,
      newTagColor: '#F44336',
      activeTags: this.props.activeTags,
      cobevyModal: false
    };
  },

  componentWillRecieveProps(nextProps) {
    this.setState({
      activeTags: nextProps.activeTags
    });
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

  handleChange() {
    this.setState({newTagValue: this.refs.newTagInput.getValue()})
  },

  submitTag() {
    this.setState({
      newTag: false,
      newTagValue: '',
      colorPicker: false
    });
    var newTagValue = this.state.newTagValue;
    var newTagColor = this.state.newTagColor;
    var tag = {name: newTagValue, color: newTagColor};
    BevyActions.update(this.props.activeBevy._id, null, null, null, tag);
  },

  handleCheck(ev, checked) {
    var tags = this.props.activeBevy.tags;
    var activeTags = this.props.activeTags;
    var $tag = _.find(tags, function(tag){ return tag.name == ev.target.name });
    if(checked && !_.find(activeTags, function(tag){ return tag.name == ev.target.name }))
      activeTags.push($tag);
    if(!checked)
      activeTags = _.reject(activeTags, function(tag){return tag.name == $tag.name });
    
    BevyActions.updateTags(activeTags);
  },

  render() {
    var bevy = this.props.activeBevy;
    var tags = bevy.tags;
    var activeTags = this.state.activeTags;
    //console.log(activeTags);
    var cobevies = bevy.cobevies;

    var tagButtons = [];

    for(var key in tags) {
      var tag = tags[key];
      var tagName = tag.name;
      var tagColor = tag.color;

      tagButtons.push( 
        <Checkbox 
          name={tag.name} 
          value={true} 
          label={tagName} 
          ref={tagName}
          className='bevy-btn'
          style={{width: '90%', color: 'rgba(0,0,0,.6)'}}
          defaultChecked={_.contains(activeTags, tag)}
          iconStyle={{
            fill: tag.color
          }}
          onCheck={this.handleCheck}
        />
      );
    }

    var colors = ['#F44336','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#00BCD4', '#009688', '#4CAF50', '#8BC34A','#CDDC39','#FFEB3B','#FFC107','#FF9800','#FF5722'];
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
      <div className='new-tag'> 
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
          style={{width: '80%'}}
        />
      </div> );
    }

    //console.log(bevy);

    var createButton = (_.isEmpty(window.bootstrap.user))
    ? <div/>
    : (
        <Button 
          className='new-bevy-btn'
          disabled={_.isEmpty(window.bootstrap.user)} 
          onClick={() => { this.setState({ newTag: !this.state.newTag }); }}>
          <span className="glyphicon glyphicon-plus"/>
        </Button>
      );

    var addCobevy = (_.isEmpty(window.bootstrap.user))
    ? <div/>
    : (
        <Button 
          className='new-bevy-btn'
          disabled={_.isEmpty(window.bootstrap.user)} 
          onClick={() => { this.setState({ cobevyModal: !this.state.cobevyModal }); }}>
          <span className="glyphicon glyphicon-plus"/>
        </Button>
      );

    var cobevyButtons = [];
    for(var key in cobevyButtons) {
      var cobevy = cobevyButtons[key];
      console.log(cobevy);
    }


    return (
      <div className='bevy-list panel'>
        <div className='panel-header'>
          <div className='super-bevy-btn'>
            tags
          </div>
          { createButton }
        </div>
        <ButtonGroup className='bevy-list-btns' role="group">
          { tagButtons }
        </ButtonGroup>
        {/*<div className='panel-header'>
          <div className='super-bevy-btn'>
            Related Bevies
          </div>
          { addCobevy }
          <CobevyModal
            show={this.state.cobevyModal}
            onHide={() => { this.setState({ cobevyModal: false }) }}
            allBevies={this.props.allBevies}
            myBevies={this.props.myBevies}
          />
        </div>
        <ButtonGroup className='bevy-list-btns' role="group">
          { cobevyButtons }
        </ButtonGroup>*/}
      </div>
    );
  }

});

module.exports = SubBevyPanel;
