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
var BevyActions = require('./../../bevy/BevyActions');
var PostStore = require('./../PostStore');
var PostActions = require('./../PostActions');
var constants = require('./../../constants');
var POST = constants.POST;

var {
  CircularProgress
} = require('material-ui');

// React class
var PostContainer = React.createClass({

  propTypes: {
    allPosts: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    sortType: React.PropTypes.string,
    activeTags: React.PropTypes.array
  },

  getInitialState() {
    return {
      allPosts: PostStore.getAll(),
      activePosts: [],
      postsLoaded: false
    };
  },

  componentDidMount() {
    PostStore.on(POST.CHANGE_ALL, this.handleChangeAll);
    // sometimes the bevy switch event completes before this is mounted
    BevyActions.switchBevy(this.props.activeBevy._id);
  },

  componentWillUnmount() {
    PostStore.off(POST.CHANGE_ALL, this.handleChangeAll);
  },

  componentDidUpdate() {
    /*var post_id = router.post_id;
    if(post_id) {
      var post = document.getElementById('post:' + post_id);
      if(post)
        post.scrollIntoView();
    }*/
  },

  handleChangeAll() {
    this.setState({
      allPosts: PostStore.getAll()
    });
    setTimeout(() => {
      this.setState({
        postsLoaded: true
      });
    }, 500);
  },

  render() {
    // load props into local vars
    var allPosts = this.state.allPosts;
    var posts = [];
    var sortType = this.props.sortType;
    var activeTags = this.props.activeTags;
    var frontBevies = this.props.frontBevies;

    if(!this.state.postsLoaded) {
      return (
        <div className='post-container' style={{ height: 100 }}>
          <div className='loading-indeterminate'>
            <CircularProgress mode="indeterminate" />
          </div>
        </div>
      );
    }
    
    if(this.props.activeBevy._id == '-1') {
      //filter posts for the frontpage here
      allPosts = _.reject(allPosts, function($post) {
        //no pinned on frontpage
        if($post.pinned) 
          return true;
        
        //filter out for new and top
        if((sortType == 'new') || (sortType == 'top')) {

          if(_.find(frontBevies, function($bevy) { return $post.bevy._id == $bevy }) == undefined) {
            return true; 
          }
        }

      });
    } else {
      // filter posts here
      allPosts = _.reject(allPosts, function($post) {
        if($post.type == 'event') return false;
        // see if the sort type matches
        if(sortType != ('events')) {
          // see if the tag matches
          if(_.find(activeTags, function($tag) {
            if(_.isEmpty($post.tag)) return false;
            return $tag.name == $post.tag.name;
          }) == undefined) return true;
          // yep, it matches
          return false;
        }
      });
    }

    // for each post
    for(var key in allPosts) {
      var post = allPosts[key];
      switch(post.type) {
        // special render for event post types
        case 'event':
          posts.push(
            <Event
              id={ post._id }
              key={ 'postcontainer:post:' + post._id }
              post={ post }
            />
          );
          break;
        default:
          posts.push(
            <Post
              id={ post._id }
              key={ 'postcontainer:post:' + post._id }
              post={ post }
            />
          );
          break;
      }
    }

    posts.push(<div key={Math.random()} style={{height: '100px'}}/>)

    // render 'no events' when no events are found
    if(allPosts.length == 0 && sortType == 'events') {
      return (
        <div className='post-container'>
          <span className='no-posts-text'>No Events :(</span>
        </div>
      );
    }

    // if filtering got rid of all posts, display no posts
    if(allPosts.length == 0) {
      return (
        <div className='post-container'>
          <span className='no-posts-text'>No Posts :(</span>
        </div>
      );
    }

    return (
      <div className='post-container'>
        {/*<CTG transitionName='example' transitionAppear={true} style={{width: '100%'}}>*/}
          { posts }
        {/*</CTG>*/}
      </div>
    );
  }
});

// pipe back to App.jsx
module.exports = PostContainer;
