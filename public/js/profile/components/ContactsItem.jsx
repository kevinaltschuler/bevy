/**
 * ContactsItem.jsx
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

var ContactsItem = React.createClass({

	propTypes: {
		  email: React.PropTypes.string
		, aliasid: React.PropTypes.string
	},

	render: function() {

		var defaultContactImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

		var contactButtonStyle = {
			backgroundImage: 'url(' + defaultContactImage + ')'
		};

		var contactName = this.props.email || "Placeholder Contact";
		var joined = (_.isEmpty(this.props.aliasid)) ? false : true;

		var contactStatus = '';
		if(!joined) contactStatus = 'invited';
		else contactStatus = this.props.aliasid;

		return <div className="row alias-item">
					<Button
						{ ...this.props}
						className='alias-btn'
						style={ contactButtonStyle }
					/>
					<div className="alias-name">
						{ contactName }
					</div>
					<div className='alias-status'>
						{ contactStatus }
					</div>
				 </div>
	}
});
module.exports = ContactsItem;
