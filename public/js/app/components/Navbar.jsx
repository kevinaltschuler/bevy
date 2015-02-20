'use strict';

var React = require('react');
var Input = require('react-bootstrap').Input;

var rbs = require('react-bootstrap')
var NavItem = rbs.NavItem;

var mui = require('material-ui');
var IconButton = mui.IconButton;
var TextField = mui.TextField;
var LeftNav = mui.LeftNav;

var	menuItems = [{ route: 'get-started', text: 'Get Started' },
					{ route: 'css-framework', text: 'CSS Framework' },
  					{ route: 'components', text: 'Components' },];

module.exports = React.createClass({
	render:function() {
		return  <div className="navbar navbar-fixed-top">
					<div className="navbar-header pull-left">
						<a className="navbar-brand" href="#">
							<IconButton iconClassName="glyphicon glyphicon-menu-hamburger" onClick={LeftNav.toggle}/>
						</a>
					</div>
					<text className="navbar-brand navbar-brand-text">Bevy</text>
					<div className="navbar-header pull-right" id="bs-example-navbar-collapse-1">
						<form className="navbar-form navbar-right" role="search">
							<div className="form-group">
								<TextField type="text" className="search-input" placeholder="  "/>
							</div>
							<IconButton iconClassName="glyphicon glyphicon-search" href="#"/>
						</form>
					</div>
				</div>;
	}

});

//<LeftNav docked={true} menuItems={menuItems} />