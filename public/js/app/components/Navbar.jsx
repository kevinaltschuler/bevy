'use strict';

var React = require('react');

module.exports = React.createClass({
	render:function() {
		return  <div className="navbar navbar-fixed-top">
					<div className="navbar-header pull-left">
						<a className="navbar-brand" href="#">
							<img src="img/navbar_logo.png"/>
						</a>
					</div>
					<text className="navbar-brand navbar-brand-text">Bevy</text>
					<div className="navbar-header pull-right" id="bs-example-navbar-collapse-1">
						<form className="navbar-form navbar-right" role="search">
							<div className="form-group" /*style="padding-right: 10px"*/>
								<input type="text" className="search-input" placeholder="  "/>
							</div>
							<span className="glyphicon glyphicon-search search-icon"/*style="color:#FFF"*/></span>
						</form>
					</div>
				</div>;
	}

})