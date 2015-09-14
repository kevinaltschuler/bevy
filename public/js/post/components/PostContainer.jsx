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
    activeTags: React.PropTypes.array,
    frontBevies: React.PropTypes.array
  },

  getInitialState() {
    return {
      allPosts: PostStore.getAll(),
      activePosts: [],
      postsLoaded: false,
      loading: false
    };
  },

  componentWillReceiveProps(nextProps) {
    //this.setState({
    //  allPosts: this.props.allPosts
    //});
  },

  componentDidMount() {
    PostStore.on(POST.CHANGE_ALL, this.handleChangeAll);
    // sometimes the bevy switch event completes before this is mounted
    BevyActions.switchBevy(this.props.activeBevy._id);
    //PostActions.fetch(this.props.activeBevy._id);

    var node = this.getDOMNode();
    node.scrollTop = node.scrollHeight;
  },

  componentWillUnmount() {
    PostStore.off(POST.CHANGE_ALL, this.handleChangeAll);
  },

  componentWillUpdate() {
    var node = this.getDOMNode();
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight == node.scrollHeight;
  },

  componentDidUpdate() {
    var node = this.getDOMNode();
    //if(this.prevScrollHeight < node.scrollHeight) {
    //  node.scrollTop = node.scrollHeight - this.prevScrollHeight - 20;
    //}
    if(this.shouldScrollBottom) {
      node.scrollTop = node.scrollHeight;
    }
  },

  onScroll(ev) {
    console.log(ev.deltaY);
    var node = this.getDOMNode();
    console.log(node.scrollTop, node.scrollHeight);
    if(node.scrollTop >= node.scrollHeight) {
      console.log('buts');
      // load more
      this.setState({
        loading: true
      });
      //this.prevScrollHeight = node.scrollHeight;

      //ChatActions.loadMore(this.props.thread._id);
    }
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
    var allPosts = this.state.allPosts || [];
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
        if($post.pinned) return true;
        if(!_.contains(frontBevies, $post.bevy._id) && frontBevies.length > 0) {
          return true;
        }
        return false;
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

    // render 'no events' when no events are found
    if(posts.length == 0 && sortType == 'events') {
      return (
        <div className='post-container'>
          <span className='no-posts-text'>No Events :(</span>
        </div>
      );
    }

    // if filtering got rid of all posts, display no posts
    if(posts.length == 0) {
      return (
        <div className='post-container'>
          <span className='no-posts-text'>No Posts :(</span>
        </div>
      );
    }

    posts.push(<div key='postcontainer:spacer' style={{height: '100px'}}/>)

    return (
      <div className='post-container' onScroll={ this.onScroll }>
        { posts }
      </div>
    );
  }
});

// pipe back to App.jsx
module.exports = PostContainer;
