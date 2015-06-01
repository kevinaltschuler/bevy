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

var classNames = require('classnames');

var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var CollapsibleMixin = rbs.CollapsibleMixin;
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

var Uploader = require('./../../shared/components/Uploader.jsx');

var PostActions = require('./../PostActions');

var hintTexts = [
	"What's on your mind?",
	"What's up?",
	"How's it going?",
	"What's new?",
	"How are you doing today?",
	"Share your thoughts",
	"Drop some knowledge son"
]
var hintText = hintTexts[Math.floor(Math.random() * 4)];

var user = window.bootstrap.user;

// React class
var NewPostPanel = React.createClass({

	mixins: [CollapsibleMixin],

	propTypes: {
		activeBevy: React.PropTypes.object.isRequired,
		allBevies: React.PropTypes.array.isRequired,
	},

	// start with an empty title
	// TODO: when the dialog is expanded, add the default options here
	getInitialState: function() {
		return {
			title: '',
			images: [],
			bevies: [],
			selectedIndex: 0
		};
	},

	componentWillReceiveProps: function(nextProps) {

		// load bevies
		var bevies = [];
		var allBevies = nextProps.allBevies;
		for(var key in allBevies) {
			var bevy = allBevies[key];
			if(bevy._id != -1) {
				bevies.push({
					payload: key,
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

	getCollapsibleDOMNode: function(){
		return React.findDOMNode(this.refs.collapse);
	},

	getCollapsibleDimensionValue: function(){
		return React.findDOMNode(this.refs.collapse).scrollHeight;
	},

	open: function() {
		this.setState({
			expanded: true
		});
	},

	close: function() {

		PostActions.cancel();

		this.setState({
			expanded: false,
			title: '',
			images: []
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
	submit: function() {

		// close the post panel
		this.close();

		// send the create action
		PostActions.create(
			this.state.title, // title
			this.state.images, // image_url
			window.bootstrap.user, // author
			this.props.allBevies[this.state.selectedIndex + 1], // bevy
			findMember());

		// reset fields
		this.setState(this.getInitialState());
	},

	// triggered every time a key is pressed
	// updates the state
	handleChange: function() {
		this.setState({
			title: this.refs.title.getValue()
		});
	},

	onBevyChange: function(e, selectedIndex, menuItem) {
		this.setState({
			selectedIndex: selectedIndex
		});
	},

	findMember: function() {
		var members = this.props.activeBevy.members;
		return _.find(members, function(member) {
			if(member.user._id == user._id) return true;
			else return false;
		});
	},

	render: function() {

		var styles = this.getCollapsibleClassSet();
		//var classSet = React.addons.classSet;
		//console.log(styles);
		var dropzoneOptions = {
			acceptedFiles: 'image/*',
			thumbnailWidth: 500,
			thumbnailHeight: 500,
			dictDefaultMessage: 'Upload a Picture',
			addRemoveLinks: true,
			clickable: '.mui-floating-action-button',
		};

		var bevies = this.state.bevies;
		var selectedIndex = this.state.selectedIndex;
		var beviesDropdown = (bevies.length < 1)
		? ''
		: (<DropDownMenu
				autoWidth={false}
				menuItems={bevies}
				selectedIndex={ selectedIndex }
				onChange={ this.onBevyChange }
			/>);

		return <Panel className="panel new-post-panel" postId={ this.state.id }>

					<div className="new-post-title">
						<TextField
							className="title-field"
							hintText={ hintText }
							ref='title'
							multiLine={ true }
							value={ this.state.title }
							onChange={ this.handleChange }
							onFocus={ this.open }
						/>
					</div>

					<div ref='collapse' className={ classNames(styles) }>

						<Uploader
							onUploadComplete={ this.onUploadComplete }
							dropzoneOptions={ dropzoneOptions }
							className="dropzone"
						/>



						<div className="panel-bottom row">
							<div className="panel-controls-left  col-xs-7">
									<FloatingActionButton iconClassName="glyphicon glyphicon-paperclip" onClick= { this.preventDefault }/>
									{beviesDropdown}
							</div>
							<div className="panel-controls-right col-xs-5">
								<FlatButton
									label='cancel'
									onClick={ this.close }
								/>
								<RaisedButton label="submit" onClick={this.submit} />
							</div>
						</div>
					</div>

				</Panel>
			}
		});

module.exports = NewPostPanel;
