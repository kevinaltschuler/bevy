/**
 * PostContainer.jsx
 * React Component that manages and wraps around
 * Post panels
 * @author albert
 */

'use strict';

// imports
var React = require('react');
var _ = require('underscore');
var CTG = React.addons.CSSTransitionGroup;

var Post = require('./Post.jsx');
var Event = require('./Event.jsx');

var router = require('./../../router');
var PostStore = require('./../PostStore');
var constants = require('./../../constants');
var POST = constants.POST;

// React class
var PostContainer = React.createClass({

  // expects App.jsx to pass in Posts collection
  // see App.jsx and PostStore.js for more details
  propTypes: {
    sortType: React.PropTypes.string,
    activeTags: React.PropTypes.array
  },

  getInitialState() {
    return {
      allPosts: PostStore.getAll(),
      activePosts: []
    };
  },

  componentDidMount() {
    PostStore.on(POST.CHANGE_ALL, this.handleChangeAll);
  },

  componentWillUnmount() {
    PostStore.off(POST.CHANGE_ALL, this.handleChangeAll);
  },

  componentDidUpdate() {
    var post_id = router.post_id;
    if(post_id) {
      var post = document.getElementById('post:' + post_id);
      if(post)
        post.scrollIntoView();
    }
  },

  componentWillRecieveProps(nextProps) {
    this.forceUpdate();
  },

  handleChangeAll() {
    this.setState({
      allPosts: PostStore.getAll()
    });
  },

  render() {
    // load props into local vars
    var allPosts = this.state.allPosts;
    var posts = [];
    var sortType = this.props.sortType;
    var activeTags = this.props.activeTags;

    // for each post
    for(var key in allPosts) {
      var post = allPosts[key];
      // load post into array
      switch(post.type) {
        case 'event':
          if(sortType == 'events') {
            posts.push(
              <Event
                id={post._id}
                post={ post }
              />
            );
          }
          break;
        default:
          //console.log(activeTags, post.tag);
          if(sortType != 'events' && _.find(activeTags, function(tag){ return post.tag.name == tag.name})) {
            posts.push(
              <Post
                post={ post }
                id={post._id}
              />
            );
          }
          break;
      }
    }

    return (
      <div className='post-container'>
          {posts}
      </div>
    );
  }
});

// pipe back to App.jsx
module.exports = PostContainer;
