/**
 * FrontPage.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');

var constants = require('./../../constants');
var router = require('./../../router');

var user = window.bootstrap.user;

var rbs = require('react-bootstrap');
var Button = rbs.Button;

var PublicBevyPanel = require('./../../bevy/components/PublicBevyPanel.jsx');
var FilterSidebar = require('./FilterSidebar.jsx');

var FrontPage = React.createClass({

  propTypes: {
    publicBevies: React.PropTypes.array.isRequired,
    myBevies: React.PropTypes.array
  },

  render() {
    var publicBevies = this.props.publicBevies;
    var myBevies = this.props.myBevies;

    var publicBevyPanels = [];

    for(var key in publicBevies) {
      var bevy = publicBevies[key];
      publicBevyPanels.push(
        <PublicBevyPanel bevy={bevy} myBevies={this.props.myBevies} />
      );
    };

    return (
      <div className='public-bevy-wrapper'>
          <div className='mid-section'>
            <FilterSidebar {...this.props} />
          </div>
        <div className="footer-public-bevies">
          <div className='footer-left'>
            Bevy © 2015 
          </div>
          <div className='footer-right'>
            <Button className="bevy-logo-btn" href='/'>
              <div className='bevy-logo-img' style={{backgroundImage: 'url(/img/logo_100.png)'}}/>
            </Button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = FrontPage;
