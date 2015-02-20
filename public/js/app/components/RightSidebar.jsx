'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var Button = rbs.Button;
var ButtonGroup = rbs.ButtonGroup;
var DropdownButton = rbs.DropdownButton;
var MenuItem = rbs.MenuItem;

module.exports = React.createClass({
      render: function() {
      	return  <ButtonGroup className="col-sm-2 hidden-xs btn-group right-sidebar">
                  <DropdownButton title='Notifications'>
                    <MenuItem eventKey="1">Action</MenuItem>
                  </DropdownButton>
                  <Badge>2</Badge>
                    <br/>
                  <DropdownButton title='Invites'>
                    <MenuItem eventKey="1">Action</MenuItem> 
                  </DropdownButton>
                </ButtonGroup>;
              }
});