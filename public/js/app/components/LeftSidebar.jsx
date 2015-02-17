'use strict';

var React = require('react');

module.exports = React.createClass({
      render: function() {
        return <div className="col-md-3 hidden-xs btn-group left-sidebar" role="group">
                <text className="btn-group-text">
                  <button type="button" className="sort-btn btn active">Front Page</button>
                  <br/>
                    <button type="button" className="sort-btn btn">New England Melee</button>
                  <br/>
                  <button type="button" className="sort-btn btn">
                    Burlap  
                    <span className="badge">12</span>
                  </button>
                  <br/>
                  <button type="button" className="sort-btn btn">
                    Neu Frisbee  
                    <span className="badge">4</span>
                  </button> 
                  <br/>
                    <button type="button" className="sort-btn btn">Bevy Team</button>
                  <br/>
                </text>
              </div>;
  }
});