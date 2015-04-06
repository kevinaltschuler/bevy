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

var MemberItem = React.createClass({

	propTypes: {
		  email: React.PropTypes.string
		, aliasid: React.PropTypes.object
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
							{ contactStatus.name }
						</div>
					</div>

					<div className='col-xs-3'>
						<Button>
						Remove
						</Button>
					</div>

				 </div>
	}
});
module.exports = MemberItem;
