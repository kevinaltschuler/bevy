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

var BevyActions = require('./../BevyActions');

var SubBevyPanel = React.createClass({

  propTypes: {
    myBevies: React.PropTypes.array.isRequired,
    activeBevy: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      newTag: false,
      newTagValue: '',
      colorPicker: false,
      newTagColor: '#F44336',
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

  handleChange() {
    this.setState({newTagValue: this.refs.newTagInput.getValue()})
  },

  submitTag() {
    this.setState({
      newTag: false,
      newTagValue: '',
      colorPicker: false,
      newTagColor: '#F44336'
    });
    var newTagValue = this.state.newTagValue;
    var newTagColor = this.state.newTagColor;
    BevyActions.update(this.props.activeBevy._id, null, null, null, {newTagValue, newTagColor}, null);
  },

  render() {
    var bevy = this.props.activeBevy;
    var tags = bevy.tags;

    var tagButtons = [];
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
    for(var key in tags) {
      var tag = tags[key];
      tagButtons.push( <Input type='checkbox' label={tag.name} checked className='bevy-btn' />);
    }

    var colors = ['#F44336','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#00BCD4', '#009688', '#4CAF50', '#8BC34A','#CDDC39','#FFEB3B','#FFC107','#FF9800','#FF5722'];
    var colorButtons = [];
    for(var key in colors) {
      var color = colors[key];
      colorButtons.push(<Button className='color' style={{backgroundColor: color}} id={color} onClick={(ev) => { this.setState({newTagColor: ev.target.getAttribute('id'), colorPicker: false}); }} />)
    }

    var colorPicker = (this.state.colorPicker)
    ? (<div className='panel color-picker-modal'>
            {colorButtons}
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
          onClick={() => { this.setState({ newTag: true }); }}>
          <span className="glyphicon glyphicon-plus"/>
        </Button>);


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
      </div>
    );
  }

});

module.exports = SubBevyPanel;
