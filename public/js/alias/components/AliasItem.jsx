/**
 * AliasItem.jsx
 *
 * @author albert
 */

var React = require('react');
var $ = require('jquery');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;
var Button = rbs.Button;
var user = window.bootstrap.user;

var AliasActions = require('./../AliasActions');

var AliasItem = React.createClass({

	propTypes: {
		alias: React.PropTypes.object
	},

	switch: function(ev) {
		var $target = $(ev.target);
		//console.log($target.attr('id'));

		AliasActions.switch($target.attr('id'));
	},

	destroy: function(ev) {
		if(!window.confirm('Are you sure?')) return;
		//if(!this.props.alias) return;
		var id = this.props.alias._id;

		AliasActions.destroy(id);
	},

	edit: function(ev) {

	},

	render: function() {

		var alias = this.props.alias;
		if(!alias) {
			// no alias
			return <div></div>;
		}

		var defaultAliasImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';
		var aliasImage = (user.google.photos)
		 ? defaultAliasImage
		 : user.google.photos[0].value;

		var aliasButtonStyle = {
			backgroundImage: 'url(' + aliasImage + ')'
		};

		return <div className="row alias-item">
					<Button
						{ ...this.props}
						className='alias-btn'
						style={ aliasButtonStyle }
						ref='alias'
						onClick={ this.switch } >
					</Button>
					<div className="alias-name">
						{ alias.name }
					</div>
					<Button className="delete-alias"
						ref='delete'
						onClick={ this.destroy } >
						<span className="glyphicon glyphicon-remove" />
					</Button>
				 </div>
	}
});
module.exports = AliasItem;
