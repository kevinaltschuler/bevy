'use strict';

var React = require('react');
var Badge = require('react-bootstrap').Badge;

module.exports = React.createClass({
      render: function() {
      	return  <div className="col-sm-2 hidden-xs btn-group right-sidebar">
                  <div id="dropdown" className="ddmenu sort-btn">
                    Notifications <Badge>2</Badge> <span className="caret"></span>
                  </div>
                    <br/>
                  <div>
                    Invites <span className="caret"></span>
                  </div>
                </div>;
      	  }
});