/**
 * BevyList.jsx
 *
 * List of bevies
 *
 * @author albert
 */

'use strict';

var React = require('react');
var ReactPropTypes = React.PropTypes;

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var Button = rbs.Button;
var ButtonGroup = rbs.ButtonGroup;
var ModalTrigger = rbs.ModalTrigger;

var mui = require('material-ui');
var IconButton = mui.IconButton;

var CreateNewBevy = require('./../../modals/components/CreateNewBevy.jsx');

var BevyList = React.createClass({

	propTypes: {
		allBevies: ReactPropTypes.array.isRequired
	},

	getInitialState: function() {
		return {};
	},

	render: function() {
		var allBevies = this.props.allBevies;
		var bevies = [];

		bevies.push(<Button key='0' type='button' className='bevy-btn btn'>Front Page</Button>)
		for(var key in allBevies) {
			var bevy = allBevies[key];
			bevies.push(<Button key={ bevy._id } type="button" className="bevy-btn btn">{ bevy.name }</Button>);
		}

		return	<ButtonGroup className="col-sm-3 hidden-xs btn-group left-sidebar" role="group">
						<text className="btn-group-text">
							{bevies}
							<ModalTrigger modal={<CreateNewBevy />}>
								<IconButton iconClassName="glyphicon glyphicon-plus" tooltip="Create new bevy"/>
							</ModalTrigger>
						</text>
					</ButtonGroup>;
	}

});

module.exports = BevyList;
