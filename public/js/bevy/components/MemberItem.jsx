/**
 * MemberItem.jsx
 *
 * @author KEVIN
 * @author albert
 */

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;
var Button = rbs.Button;
var Panel = rbs.Panel;

var mui = require('material-ui');
var RaisedButton = mui.FlatButton;

var BevyActions = require('./../BevyActions');

var MemberItem = React.createClass({

	propTypes: {
		contact: React.PropTypes.object,
		activeBevy: React.PropTypes.object,
		activeMember: React.PropTypes.object,
		active: React.PropTypes.bool
	},

	remove: function(ev) {
		ev.preventDefault();

		var bevy_id = this.props.activeBevy._id;
		var user_id = (_.isObject(this.props.contact.user)) ? this.props.contact.user._id : null;

		BevyActions.removeUser(bevy_id, this.props.contact.email, user_id);
	},

	render: function() {

		var defaultContactImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';
		var contactImage = defaultContactImage;

		var contact = this.props.contact;

		var contactName = contact.email || "Placeholder Contact";
		var joined = (_.isEmpty(contact.user)) ? false : true;

		var contactStatus = '';
		if(!joined) contactStatus = '[invited]';
		else contactStatus = contact.user.displayName;

		if(joined)
			if(contact.displayName) contactStatus = this.props.contact.displayName;

		if(joined) {
			contactImage = (contact.user.google && contact.user.google.photos)
			? contact.user.google.photos[0].value
			: defaultContactImage;

			if(contact.user.image_url) contactImage = contact.user.image_url;
		}

		var contactButtonStyle = {
			backgroundImage: 'url(' + contactImage + ')'
		};

		var removeButton = '';
		if(!_.isEmpty(this.props.activeMember)) {
			if(this.props.activeMember.role == 'admin')
				removeButton = (
					<RaisedButton label="remove" onClick={this.remove} />);
		}

		var className = 'row';
		if(this.props.active) className += ' active';

		return <div className="member-item row">

					<div className='col-xs-2'>
						<Button
							className='contact-btn'
							style={ contactButtonStyle }
						/>
					</div>

					<div className='col-xs-5'>
						<span className='member-contact-name'>
							{ contactName }
						</span>
						<span className='member-contact-status'>
							{ contactStatus }
						</span>
					</div>

					<div className='col-xs-2'>
						<span className='member-contact-role'>{ this.props.contact.role || 'user' }</span>
					</div>

					<div className='col-xs-3'>
						{ removeButton }
					</div>

				 </div>
	}
});
module.exports = MemberItem;
