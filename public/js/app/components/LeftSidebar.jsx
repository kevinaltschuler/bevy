'use strict';

var React = require('react');
var Badge = require('react-bootstrap').Badge;

module.exports = React.createClass({
      render: function() {
        return <div className="col-md-3 hidden-xs btn-group left-sidebar" role="group">
                <text className="btn-group-text">
                  <button type="button" className="sort-btn btn active">Front Page</button>
                  <br/>
                    <button type="button" className="sort-btn btn">New England Melee</button>
                  <br/>
                  <button type="button" className="sort-btn btn">
                    Burlap <Badge>12</Badge>
                  </button>
                  <br/>
                  <button type="button" className="sort-btn btn">
                    Neu Frisbee <Badge>4</Badge>
                  </button> 
                  <br/>
                    <button type="button" className="sort-btn btn">Bevy Team</button>
                  <br/>
                </text>
              </div>;
  }
});