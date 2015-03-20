/**
 * NewPostPanel.jsx
 *
 * The dialog for creating a post
 *
 * @author kevin
 */

'use strict';

// imports
var React = require('react');

var rbs = require('react-bootstrap');
var OverlayTrigger = rbs.OverlayTrigger;
var Tooltip = rbs.Tooltip;
var Input = rbs.Input;
var Panel = rbs.Panel;

var mui = require('material-ui');
var IconButton = mui.IconButton;
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;
var DropDownMenu = mui.DropDownMenu;
var FloatingActionButton = mui.FloatingActionButton;

var PostActions = require('./../PostActions');
var PostSubmitButtons = require('./PostSubmitButtons.jsx');

// React class
var NewPostPanel = React.createClass({

	propTypes: {
		  activeBevy: React.PropTypes.object.isRequired
		, activeAlias: React.PropTypes.object.isRequired
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

		var bevies = [
			{ payload: '1', text: 'The Burlap' },
			{ payload: '2', text: 'Monsta Island Czars' },
		];

		return	<Panel className="panel new-post-panel" postId={ this.state.id }>
					<div className="row new-post-title">
						<TextField className="title-field" hintText="Title" />
					</div>
					<div className="row media">
						<div className="media-content">
								<FloatingActionButton className="attach-btn" iconClassName="glyphicon glyphicon-paperclip" tooltip="attach media" mini={true}/>
						</div>
					</div>
					<Input className="post-body-text" type="textarea" placeholder="Body"/>
					<div className="panel-bottom">
						<div className="panel-controls-right">
							<FlatButton label="cancel" />
							<RaisedButton label="submit" onClick={this.submit} />
						</div>
						<div className="panel-controls-left">
							<DropDownMenu className="bevies-dropdown" menuItems={bevies} />
						</div>
					</div>
				</Panel>
			}
		});

module.exports = NewPostPanel;
