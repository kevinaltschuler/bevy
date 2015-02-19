'use strict';

var React = require('react');
var Input = require('react-bootstrap').Input;
var NavItem = require('react-bootstrap').NavItem;
var IconButton = require('material-ui').IconButton;


module.exports = React.createClass({
	render:function() {
		return  <div className="navbar navbar-fixed-top">
					<div className="navbar-header pull-left">
						<a className="navbar-brand" href="#">
							<IconButton iconClassName="glyphicon glyphicon-menu-hamburger" href="#"/>
						</a>
					</div>
					<text className="navbar-brand navbar-brand-text">Bevy</text>
					<div className="navbar-header pull-right" id="bs-example-navbar-collapse-1">
						<form className="navbar-form navbar-right" role="search">
							<div className="form-group">
								<input type="text" className="search-input" placeholder="  "/>
							</div>
							<IconButton iconClassName="glyphicon glyphicon-search" href="#"/>
						</form>
					</div>
				</div>;
	}

})
