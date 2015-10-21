/**
 * FrontPage.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var {
  Button
} = require('react-bootstrap');
var FrontpageSidebar = require('./FrontpageSidebar.jsx');
var PostContainer = require('./../../post/components/PostContainer.jsx');
var Footer = require('./Footer.jsx');

var constants = require('./../../constants');
var router = require('./../../router');
var user = window.bootstrap.user;

var FrontPage = React.createClass({

  propTypes: {
    allPosts: React.PropTypes.array,
    frontBevies: React.PropTypes.array,
    sortType: React.PropTypes.string,
    activeBevy: React.PropTypes.object,
    myBevies: React.PropTypes.array
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
      <div className='frontpage-wrapper'>
        <div className='mid-section'>
          <div className='left-sidebar'>
            <div className='fixed'>
              <div className='hide-scroll'>
                <FrontpageSidebar 
                  frontBevies={ this.props.frontBevies }
                  myBevies={ this.props.myBevies }
                  activeBevy={ this.props.activeBevy }
                  sortType={ this.props.sortType }
                />
                <Footer />
              </div>
            </div>
          </div>
          <div className='frontpage-container'>
            <PostContainer
              allPosts={ this.props.allPosts }
              activeBevy={activeBevy}
              sortType={this.props.sortType}
              activeTags={[]}
              frontBevies={ this.props.frontBevies }
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = FrontPage;