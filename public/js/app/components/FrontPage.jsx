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

var FrontpageSidebar = require('./FrontpageSidebar.jsx');
var PostContainer = require('./../../post/components/PostContainer.jsx');
var PostSort = require('./../../post/components/PostSort.jsx');

var FrontPage = React.createClass({

  propTypes: {
    allPosts: React.PropTypes.array
  },

  render() {

    var activeBevy = {
        "_id" : "-1",
        "name" : "frontpage",
        "description" : "",
        "image_url" : "",
        "settings" : {
        },
        "siblings" : [ 
        ],
        "tags" : [ 
        ],
        "admins" : [ 
        ],
        "subCount" : 0,
        "__v" : 0
    }

    return (
      <div>
        <div className='frontpage-wrapper'>
          <div className='mid-section'>
            <div className='left-sidebar'>
              <FrontpageSidebar 
                frontBevies={ this.props.frontBevies }
                myBevies={ this.props.myBevies }
              />
            </div>
            <div className='frontpage-container'>
              <PostContainer
                allPosts={ this.props.allPosts }
                activeBevy={activeBevy}
                sortType={'top'}
                activeTags={{}}
                frontBevies={ this.props.frontBevies }
              />
            </div>
            </div>
          </div>
        <div className="footer-frontpage">
          <div className='footer-left'>
            Bevy © 2015 
          </div>
          <div className='footer-right'>
            <Button className="bevy-logo-btn" href='/'>
              <div className='bevy-logo-img' style={{ backgroundImage: 'url(/img/logo_100.png)' }}/>
            </Button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = FrontPage;
