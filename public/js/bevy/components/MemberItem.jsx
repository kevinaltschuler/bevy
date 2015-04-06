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

var BevyActions = require('./../BevyActions');

var MemberItem = React.createClass({

	propTypes: {
		  email: React.PropTypes.string
		, aliasid: React.PropTypes.object
		, activeBevy: React.PropTypes.object
	},

	remove: function(ev) {
		ev.preventDefault();

		var bevy_id = this.props.activeBevy.id;

		BevyActions.leave(bevy_id, this.props.email, this.props.aliasid);
	},

	render: function() {

		var defaultContactImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

		var contactButtonStyle = {
			backgroundImage: 'url(' + defaultContactImage + ')'
		};

		var contactName = this.props.email || "Placeholder Contact";
		var joined = (_.isEmpty(this.props.aliasid)) ? false : true;

		var contactStatus = '';
		if(!joined) contactStatus = '[invited]';
		else contactStatus = this.props.aliasid.name;

		return <div className="row alias-item">

					<div className='col-xs-3'>
						<Button
							{ ...this.props}
							className='alias-btn'
							style={ contactButtonStyle }
						/>
					</div>

					<div className='col-xs-6'>
						<div className="alias-name">
							{ contactName }
						</div>
						<div className='alias-status'>
							{ contactStatus }
						</div>
					</div>

					<div className='col-xs-3'>
						<Button
							onClick={ this.remove }
						>
						Remove
						</Button>
					</div>

				 </div>
	}
});
module.exports = MemberItem;
