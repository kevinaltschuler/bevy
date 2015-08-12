/**
 * BevyPanel.jsx
 * formerly RightSidebar.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var ButtonGroup = rbs.ButtonGroup;
var MenuItem = rbs.MenuItem;
var Accordion = rbs.Accordion;
var Panel = rbs.Panel;
var Button = rbs.Button;
var Input = rbs.Input;
var ModalTrigger = rbs.ModalTrigger;

var mui = require('material-ui');
var DropDownMenu = mui.DropDownMenu;
var IconButton = mui.IconButton;
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var FlatButton = mui.FlatButton;

var BevySettingsModal = require('./BevySettingsModal.jsx');
var BevyPanelHeader = require('./BevyPanelHeader.jsx');

var BevyActions = require('./../BevyActions');

var Uploader = require('./../../shared/components/Uploader.jsx');

var NotificationHeader;

var user = window.bootstrap.user;

var BevyPanel = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object,
		myBevies: React.PropTypes.array.isRequired
	},

	getInitialState: function() {

		var activeBevy = this.props.activeBevy;
		var joined = _.findWhere(this.props.myBevies, { _id: activeBevy._id }) != undefined;

		return {
			name: activeBevy.name || '',
			description: activeBevy.description || '',
			image_url: activeBevy.image_url || '',
			isEditing: false,
			joined: joined
		};
	},

	componentWillReceiveProps: function(nextProps) {
		var bevy = nextProps.activeBevy;

		this.setState({
			name: bevy.name,
			description: bevy.description,
			image_url: bevy.image_url,
		});
	},

	onChange: function(ev) {
		this.setState({
			name: this.refs.name.getValue(),
			description: this.refs.description.getValue()
		});
	},

	onRequestJoin: function(ev) {
		ev.preventDefault();

		BevyActions.join(this.props.activeBevy._id, window.bootstrap.user._id, window.bootstrap.user.email);

		var bevy = this.props.bevy;
		var joined = true;

		this.setState({
			joined: joined
		});
	},

	onRequestLeave: function(ev) {
		ev.preventDefault();

		BevyActions.leave(this.props.activeBevy._id);

		var bevy = this.props.bevy;
		var joined = false;

		this.setState({
			joined: joined
		});
	},

	destroy: function(ev) {
		ev.preventDefault();

		if(!window.confirm('Are you sure?')) return;

		if(!this.props.activeBevy) return;

		var id = this.props.activeBevy.id;

		BevyActions.destroy(id);
	},

	render: function() {

		var bevy = this.props.activeBevy;
		var bevyImage = (_.isEmpty(this.state.image_url)) ? '/img/default_group_img.png' : this.state.image_url;
		var bevyImageStyle = (this.state.image_url === '/img/default_group_img.png')
		? {
			backgroundImage: 'url(' + bevyImage + ')'

		}
		: {
			backgroundImage: 'url(' + bevyImage + ')'
		};


		var imgStyle = (this.state.image_url === '/img/default_group_img.png')
		? { minWidth: '50px', height: 'auto' }
		: { minWidth: '100px', height: 'auto' };

		var name = (_.isEmpty(bevy)) ? 'not in a bevy' : this.state.name;
		var description = (_.isEmpty(bevy)) ? 'no description' : this.state.description;
		if(_.isEmpty(description)) description = 'no description';
		
		var itemIndex = 0;

		var _joinButton = (this.state.joined)
		? <FlatButton label='leave' onClick={this.onRequestLeave} />
		: <FlatButton label='join' onClick={this.onRequestJoin} /> 

		var joinButton = (_.isEmpty(window.bootstrap.user))
		? <div/>
		: _joinButton

		if(window.bootstrap.user) {
			var bottomActions = (_.find(bevy.admins, function(admin) { return window.bootstrap.user._id == admin; }))
			? (<div className='sidebar-bottom'>
					<div>
						<ModalTrigger modal={<BevySettingsModal activeBevy={this.props.activeBevy} />}>
							<FlatButton label='Settings' />
						</ModalTrigger>
					</div>
					<div>
						{ joinButton }
					</div>
				</div>)
			: (<div className='sidebar-bottom'>
					<div>
					</div>
					<div>
						{ joinButton }
					</div>
				</div>)
		}


		return (
			<div className="bevy-panel panel">
				<BevyPanelHeader {...this.props}/>
				{ bottomActions }
			</div>
		);
	}
});
module.exports = BevyPanel;
