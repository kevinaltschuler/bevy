/**
 * RegisterPage.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

// imports
var React = require('react');

var RegisterPanel = require('./RegisterPanel.jsx')

var RegisterPage = React.createClass({
	render: function() {
		return <div className='register-container'>

					<div className='register-title'>
						<h1>Create a New Account</h1>
					</div>

					<RegisterPanel />

					<div className='back-link'>
						<a href='/login'>Back to Login</a>
					</div>

					<br/>
				 </div>
	}
});

module.exports = RegisterPage;
