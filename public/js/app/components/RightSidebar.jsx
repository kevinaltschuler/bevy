'use strict';

var React = require('react');
var Badge = require('react-bootstrap').Badge;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;

module.exports = React.createClass({
      render: function() {
      	return  <div className="col-md-2 hidden-xs btn-group right-sidebar">
                    <DropdownButton bsStyle='default' title='default' key='default'>
                      <MenuItem eventKey="1">Action</MenuItem>
                      <MenuItem eventKey="2">Another action</MenuItem>
                      <MenuItem eventKey="3">Something else here</MenuItem>
                      <MenuItem divider />
                      <MenuItem eventKey="4">Separated link</MenuItem>
                    </DropdownButton>
                </div>;
      	  }
});