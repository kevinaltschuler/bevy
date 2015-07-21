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
var _ = require('underscore');

var classNames = require('classnames');

var constants = require('./../../constants');

var rbs = require('react-bootstrap');
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
var DatePicker = mui.DatePicker;

var Uploader = require('./../../shared/components/Uploader.jsx');

var PostActions = require('./../PostActions');

var hintTexts = [
	"What's on your mind?",
	"What's up?",
	"How's it going?",
	"What's new?",
	"How are you doing today?",
	"Share your thoughts",
	"Drop some knowledge buddy",
	"What would your mother think?",
	"Drop a line",
	"What's good?",
	"Tell us about last night",
	"What's gucci with the homies?",
	"What do you have to say?",
	"spit a verse",
	"Matt is waiting",
	"Can you dig it?"
]
var hintText = hintTexts[Math.floor(Math.random() * hintTexts.length)];

var user = window.bootstrap.user;

// React class
var NewPostPanel = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object.isRequired,
		superBevy: React.PropTypes.object.isRequired,
		subBevies: React.PropTypes.array.isRequired,
		myBevies: React.PropTypes.array.isRequired,
		disabled: React.PropTypes.bool
	},

	// start with an empty title
	// TODO: when the dialog is expanded, add the default options here
	getInitialState: function() {
		return {
			title: '',
			images: [],
			bevies: [],
			selectedIndex: 0,
			disabled: this.props.disabled
		};
	},

	componentWillReceiveProps: function(nextProps) {

		// load bevies
		var bevies = [];
		bevies.push({
			payload: 0,
			text: nextProps.superBevy.name,
			id: nextProps.superBevy._id
		});
		var subBevies = nextProps.subBevies;
		for(var key in subBevies) {
			var bevy = subBevies[key];
			if(bevy._id != -1) {
				bevies.push({
					payload: key + 1,
					text: bevy.name,
					id: bevy._id
				});
			}
		}

		var selectedIndex = nextProps.selectedIndex || 0;
		bevies.forEach(function(bevy, index) {
			if(bevy.id === nextProps.activeBevy._id) selectedIndex = index;
		});

		this.setState({
			bevies: bevies,
			selectedIndex: selectedIndex
		});
	},

	onUploadComplete: function(file) {
		var filename = file.filename;
		var image_url = constants.apiurl + '/files/' + filename;
		var images = this.state.images;
		images.push(image_url);
		this.setState({
			images: images
		});
	},


	// trigger the create action
	// TODO: pass in the rest of the state attributes needed
	submit: function(ev) {
		ev.preventDefault();

		// send the create action
		PostActions.create(
			this.state.title, // title
			this.state.images, // image_url
			window.bootstrap.user, // author
			this.props.activeBevy, // bevy
			null // event
		);

		// reset fields
		this.setState(this.getInitialState());
	},

	// triggered every time a key is pressed
	// updates the state
	handleChange: function() {
		this.setState({
			title: this.refs.title.getValue(),
			description: this.refs.description.getValue(),
			location: this.refs.location.getValue(),
			date: this.refs.date.getValue()
		});
	},

	onBevyChange: function(e, selectedIndex, menuItem) {
		this.setState({
			selectedIndex: selectedIndex
		});
	},

	eventToggle: function(ev) {
		ev.preventDefault();
		if(this.state.type == 'event') {
			this.setState({
				type: null,
			});
		} else {
			this.setState({
				type: 'event'
			});
		}
	},

	render: function() {

		var dropzoneOptions = {
			acceptedFiles: 'image/*',
			thumbnailWidth: 500,
			thumbnailHeight: 500,
			dictDefaultMessage: 'Upload a Picture',
			addRemoveLinks: true,
			clickable: '.attach-picture',
		};

		var bevies = this.state.bevies;
		var selectedIndex = this.state.selectedIndex;
		var beviesDropdown = (bevies.length < 1)
		? ''
		: (<DropDownMenu
				className='bevies-dropdown'
				autoWidth={false}
				menuItems={bevies}
				selectedIndex={ selectedIndex }
				onChange={ this.onBevyChange }
			/>);

		var disabled = this.props.disabled;

		hintText = (disabled)
		? 'you must be logged in to post'
		: hintText

		if(this.props.activeBevy.admin_only) {
			disabled = true;
			hintText = 'only admins may post in this bevy';
		}

		if(this.state.type == 'event') {
			hintText = 'Event Title';
		}

		var eventDiv = (this.state.type == 'event')
		? 	(<div className='event-fields'>
				<TextField
					className="title-field"
					hintText='event description'
					ref='description'
					multiLine={ true }
					value={ this.state.description }
					onChange={ this.handleChange }
					disabled={ disabled }
				/>
				<TextField
					className="title-field"
					hintText='location'
					ref='location'
					value={ this.state.location }
					onChange={ this.handleChange }
					disabled={ disabled }
				/>
				<TextField
					className="title-field"
					hintText='date'
					ref='date'
					value={ this.state.date }
					onChange={ this.handleChange }
					disabled={ disabled }
				/>
			</div>)
		: 	(<div/>);

		return (
			<Panel className="panel new-post-panel" postId={ this.state.id }>
				<div className="new-post-title">
					<TextField
						className="title-field"
						hintText={ hintText }
						ref='title'
						multiLine={ true }
						value={ this.state.title }
						onChange={ this.handleChange }
						disabled={ disabled }
					/>
				</div>

				{eventDiv}

				<Uploader
					onUploadComplete={ this.onUploadComplete }
					dropzoneOptions={ dropzoneOptions }
					className="dropzone"
				/>

				<div className="panel-bottom">
					<div className='paperclip action'>
						<FloatingActionButton
							title="Attach Media"
							iconClassName="attach-picture glyphicon glyphicon-picture"
							onClick={ this.preventDefault }
							disabled={ disabled }
						/>
						<FloatingActionButton
							title="New Event"
							iconClassName="glyphicon glyphicon-calendar"
							onClick={ this.eventToggle }
							disabled={ disabled }
						/>
					</div>
					{ beviesDropdown }
					<RaisedButton
						label="post"
						onClick={this.submit}
						disabled={ disabled }
					/>
				</div>
			</Panel>
		);
	}
});

module.exports = NewPostPanel;
