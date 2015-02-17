'use strict';

var React = require('react');

module.exports = React.createClass({
      render: function() {
      	return         <div className="col-md-2 hidden-xs btn-group right-sidebar">
          <div id="dropdown" className="ddmenu sort-btn">
            Notifications
            <span className="badge">2</span> 
            <span className="caret"></span>
            <ul>
              <li><a className="sort-btn" role="menuitem" href="#">
                Josh Guerrero and two others commented on Your Post &#34;Owl Spread-ing his Wings&#34;</a></li>
              <li><a className="sort-btn" role="menuitem" href="#">
                Tyler Speck and two others commented on your post &#34;Bvy.io is the-greatest&#34;</a></li>
            </ul>
          </div>
          <div id="dropdown" className="ddmenu sort-btn">
            Invites
            <span className="badge"></span> 
            <span className="caret"></span>
            <ul>
              <li><a className="sort-btn" role="menuitem" href="#">
                You have been invited to Known Scrubs bevy "Neu Melee"</a></li>
            </ul>
          </div>
        </div>;
      	  }
});