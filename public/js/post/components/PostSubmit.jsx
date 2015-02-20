'use strict';

var React = require('react');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;
var Input = require('react-bootstrap').Input;

var PostActions = require('./../PostActions');
var PostSubmitButtons = require('./PostSubmitButtons.jsx');

module.exports = React.createClass({

	submit: function(ev) {
		//ev.preventDefault();
		PostActions.create(this.refs.input.getValue());
	},

	getInitialState: function() {
		return { };
	},

	handleChange: function(ev) {
		//if the user hits enter, submit a new post
		if(ev.which === 13) {
			this.submit(ev);
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
					 onKeyUp={this.handleChange}>
					</Input>
	}
});


