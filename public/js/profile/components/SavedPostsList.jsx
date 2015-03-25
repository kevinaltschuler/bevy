/**
 * SavedPostsList.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;

var SavedPostsItem = require('./SavedPostsItem.jsx');

var user = window.bootstrap.user;
//console.log(user);

var SavedPostsList = React.createClass({

	render: function() {

		return <div>
				 	<SavedPostsItem id="9999" />
				 </div>
	}
});
module.exports = SavedPostsList;
