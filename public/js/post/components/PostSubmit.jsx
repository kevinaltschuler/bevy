'use strict';

var React = require('react');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;
var Input = require('react-bootstrap').Input;

var PostActions = require('./../PostActions');

module.exports = React.createClass({
  

	submit: function(ev) {
		ev.preventDefault();
		PostActions.create();
	},
  
	getInitialState: function() {
		return {
			value: ''
		};
	},

	handleChange: function() {
		//if the user hits enter, submit a new post
		if(this.refs.input.getValue() === 13) {
			this.submit();
		}
		//otherwise, allow form input
		else {
			this.setState({
			  value: this.refs.input.getValue()
			});
		}
	},
	
	render: function() {
			return  <Input
					  type="text"
					  value={this.state.value}
					  placeholder="New Post"
					  hasFeedback
					  ref="input"
					  groupClassName="group-class"
					  wrapperClassName="wrapper-class"
					  labelClassName="label-class"
					  onChange={this.handleChange}/>
	}
});


