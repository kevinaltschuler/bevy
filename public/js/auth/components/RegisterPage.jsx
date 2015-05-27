/**
 * RegisterPage.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

// imports
var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var RegisterPanel = require('./RegisterPanel.jsx')

var RegisterPage = React.createClass({
	render: function() {
		return <div className='register-container'>

					<div className='register-title'>
						<h1>Create a New Account</h1>
					</div>

					<RegisterPanel />

					<div className='back-link'>
						<Link to='login'>Back to Login</Link>
					</div>

					<br/>
				 </div>
	}
});

module.exports = RegisterPage;
