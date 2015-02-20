'use strict';

var React = require('react');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;
var Input = require('react-bootstrap').Input;

var PostActions = require('./../PostActions');
var PostSubmitButtons = require('./PostSubmitButtons.jsx');

var PostSubmit = React.createClass({


	submit: function() {
		PostActions.create(this.state.title);
	},

	getInitialState: function() {
		return {
			title: ''
		};
	},

	onKeyUp: function(ev) {
		//if the user hits enter, submit a new post
		if(ev.which === 13) {
			this.submit();
			this.setState({
				title: ''
			});
		}
	},

	handleChange: function() {
		this.setState({
			title: this.refs.input.getValue()
		})
	},

	render: function() {
			return  <Input
					  type="text"
					  value={ this.state.title }
					  placeholder="New Post"
					  hasFeedback
					  ref="input"
					  groupClassName="group-class"
					  wrapperClassName="wrapper-class"
					  labelClassName="label-class"
					  onChange={ this.handleChange }
					  onKeyUp={ this.onKeyUp } />
	}
});

module.exports = PostSubmit;
