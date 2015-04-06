'use strict';

var React = require('react');

var Navbar = require('./../../app/components/Navbar.jsx');

var rbs = require('react-bootstrap');
var Panel = rbs.Paper;

var ProfilePage = React.createClass({
	render: function() {
		return <div>
					<Navbar />
					<div className="profile-page">
						<div className="col-xs-12">
							<div className="col-xs-3">
								<img src="/img/samplecover.jpg"/>
								<div className='row'><h2>Kevin Altschuler</h2></div>
								<div className='row'><h3>123 Points | 12 Bevys</h3></div>
							</div>
						</div>
					</div>
				 </div>
	}
});

module.exports = ProfilePage;
