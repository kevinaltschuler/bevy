/**
 * PostSubmit.jsx
 *
 * The dialog for creating a post
 *
 * @author albert
 */

'use strict';

// imports
var React = require('react');

var rbs = require('react-bootstrap');
var OverlayTrigger = rbs.OverlayTrigger;
var Tooltip = rbs.Tooltip;
var Input = rbs.Input;
var Panel = rbs.Panel;

var PostActions = require('./../PostActions');
var PostSubmitButtons = require('./PostSubmitButtons.jsx');

// React class
var PostSubmit = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object.isRequired,
		activeAlias: React.PropTypes.object.isRequired
	},

	// start with an empty title
	// TODO: when the dialog is expanded, add the default options here
	getInitialState: function() {
		return {
			title: ''
		};
	},

	// trigger the create action
	// TODO: pass in the rest of the state attributes needed
	submit: function() {
		PostActions.create(
			this.state.title, // title
			null, // body
			null, // image_url
			this.props.activeAlias.toJSON(), // author
			this.props.activeBevy.toJSON()); // bevy
	},

	// used to trigger the create action (enter key)
	// later, we can use this to listen for ctrl+v and other media shortcuts
	onKeyUp: function(ev) {
		//if the user hits enter, submit a new post
		if(ev.which === 13) {
			this.submit();
			// empty the current title attribute
			// in case the user wants to enter another right quick
			this.setState({
				title: ''
			});
		}
	},

	// triggered every time a key is pressed
	// updates the state
	handleChange: function() {
		this.setState({
			title: this.refs.input.getValue()
		})
	},

	render: function() {
			return <div className='col-xs-12' >
						<Input
							type="text"
							value={ this.state.title }
							placeholder="New Post"
							hasFeedback
							ref="input"
							groupClassName='post-submit-group'
							wrapperClassName='post-submit-wrapper'
							labelClassName='post-submit-label'
							onChange={ this.handleChange }
							onKeyUp={ this.onKeyUp } />
					</div>
	}
});

module.exports = PostSubmit;
