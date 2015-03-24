/**
 * ContactsItem.jsx
 *
 * @author KEVIN
 * @author albert
 */

var React = require('react');
var $ = require('jquery');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;
var Button = rbs.Button;
var Panel = rbs.Panel;

var ContactsItem = React.createClass({

	render: function() {

		var defaultContactImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

		var contactButtonStyle = {
			backgroundImage: 'url(' + defaultContactImage + ')'
		};

		var contactName = "Placeholder Contact";

		return <div className="row alias-item">
					<Button
						{ ...this.props}
						className='alias-btn'
						style={ contactButtonStyle }
						ref='alias'
						onClick={ this.switch } >
					</Button>
					<div className="alias-name">
						{ contactName }
					</div>
				 </div>
	}
});
module.exports = ContactsItem;
