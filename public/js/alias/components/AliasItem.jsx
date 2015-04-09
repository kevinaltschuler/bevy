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
var Input = rbs.Input;
var user = window.bootstrap.user;

var AliasActions = require('./../AliasActions');

var AliasItem = React.createClass({

	propTypes: {
		alias: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			isEditing: false
		};
	},

	startEditing: function(ev) {
		this.setState({
			isEditing: true
		});
	},

	stopEditing: function(ev) {
		this.setState({
			isEditing: false
		});
		AliasActions.update(this.props.alias._id, this.refs.name.getValue());
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

		var aliasName = (this.state.isEditing) ?
			<div className='alias-name'>
				<Input
					type='text'
					ref='name'
					placeholder='Alias Name'
					defaultValue={ alias.name }
				/>
				<Button
					onClick={ this.stopEditing } >
					Save
				</Button>
			</div>
			:
			<div className='alias-name'>
				<span
					onDoubleClick={ this.startEditing }
					>
					{ alias.name }
				</span>
			</div>;

		return <div className="row alias-item">
					<Button
						{ ...this.props}
						className='alias-btn'
						style={ aliasButtonStyle }
						ref='alias'
						onClick={ this.switch } >
					</Button>
					{ aliasName }
					<Button className="delete-alias"
						ref='delete'
						onClick={ this.destroy } >
						<span className="glyphicon glyphicon-remove" />
					</Button>
				 </div>
	}
});
module.exports = AliasItem;
