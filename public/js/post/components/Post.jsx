/**
 * Post.jsx
 * React class for an individual post
 * Created en masse by PostContainer.jsx
 *
 * @author kevin
 * @author albert
 */

'use strict';

// imports
var React = require('react');
var _ = require('underscore');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var router = require('./../../router');
var classNames = require('classnames');

var mui = require('material-ui');
var IconButton = mui.IconButton;
var TextField = mui.TextField;
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;

var rbs = require('react-bootstrap');
var Panel = rbs.Panel;
var DropdownButton = rbs.DropdownButton;
var MenuItem = rbs.MenuItem;
var ModalTrigger = rbs.ModalTrigger;
var Button = rbs.Button;
var Badge = rbs.Badge;
var CollapsibleMixin = rbs.CollapsibleMixin;

var CommentList = require('./CommentList.jsx');
var CommentSubmit = require('./CommentSubmit.jsx');
var CommentPanel = require('./CommentPanel.jsx');

var ImageModal  = require('./ImageModal.jsx');

var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');
var ChatActions = require('./../../chat/ChatActions');

var POST = require('./../../constants').POST;

var timeAgo = require('./../../shared/helpers/timeAgo');
var timeLeft = require('./../../shared/helpers/timeLeft');

var $ = require('jquery');

var user = window.bootstrap.user;
var email = user.email;

var urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
var youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

function getPostState(id) {
  return PostStore.getPost(id);
}

// React class
var Post = React.createClass({
  mixins: [CollapsibleMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    post: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      isEditing: false,
      title: this.props.post.title,
      post: this.props.post,
      showComments: false,
      showImageModal: false
    };
  },

  componentWillMount() {
    PostStore.on(POST.CHANGE_ONE + this.props.post._id, this._onPostChange);
  },

  componentWillRecieveProps(nextProps) {
    this.forceUpdate();
  },

  componentDidUnmount() {
    PostStore.off(POST.CHANGE_ONE + this.props.post._id, this._onPostChange);
  },

  _onPostChange() {
    this.setState({
      post: PostStore.getPost(this.props.post._id)
    });
  },

  getCollapsibleDOMNode() {
    return React.findDOMNode(this.refs.postBody);
  },

  getCollapsibleDimensionValue() {
    return React.findDOMNode(this.refs.postBody).scrollHeight;
  },

  onHandleToggle(ev) {
    ev.preventDefault();
    this.setState({
      expanded: !this.state.expanded
    });
  },

  onChange(ev) {
    this.setState({
      title: this.refs.title.getValue()
    });
  },

  upvote(ev) {
    ev.preventDefault();
    PostActions.upvote(this.props.post._id, window.bootstrap.user);
  },

  downvote(ev) {
    ev.preventDefault();
    PostActions.downvote(this.props.post._id, window.bootstrap.user);
  },

  destroy(ev) {
    ev.preventDefault();
    PostActions.destroy(this.props.post._id);
  },

  /**
   * count the summed value of all of the votes
   * for this post
   * @return {int}
   */
  countVotes() {
    var sum = 0;
    this.state.post.votes.forEach(function(vote) {
      sum += vote.score;
    });
    return sum;
  },

  findMember(user_id) {
    var members = this.state.post.bevy.members;
    return _.find(members, function(member) {
      if(!_.isObject(member.user)) return false;
      return member.user._id == user_id;
    });
  },

  startEdit(ev) {
    ev.preventDefault();
    this.setState({
      isEditing: true
    });
  },

  stopEdit(ev) {
    ev.preventDefault();
    var postTitle = this.state.title;
    PostActions.update(this.props.post._id, postTitle);
    this.setState({
      isEditing: false
    });
  },

  pin(ev) {
    ev.preventDefault();
    var post_id = this.props.post._id;
    PostActions.pin(post_id);
  },

  mute(ev) {
    ev.preventDefault();
    var post_id = this.props.post._id;
    PostActions.mute(post_id);
  },

  onTag(ev) {
    ev.preventDefault();
    var tag = ev.target.parentNode.getAttribute('id');
    router.navigate('/s/' + tag, { trigger: true });
  },

  onSwitchBevy(ev) {
    ev.preventDefault();
    var bevy_id = ev.target.parentNode.getAttribute('id');
    router.navigate('/b/' + bevy_id, { trigger: true });
  },

  onOpenThread(ev) {
    ev.preventDefault();
    var author_id = this.state.post.author._id;
    ChatActions.openThread(null, author_id);
  },

  expandComments(ev) {
    ev.preventDefault();
    this.setState({
      showComments: !this.state.showComments
    });
  },

  render() {

    var post = this.state.post;
    //console.log(post);
    var bevy = post.bevy;
    var author = post.author;
    var commentCount = (post.allComments)
    ? post.allComments.length
    :   0;

    var defaultProfileImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';
    var profileImage = (post.author.image_url)
    ? post.author.image_url
    : defaultProfileImage;

    var authorName;
    authorName = 'placeholder-author';
    if(author) {
      authorName = author.displayName;
    }

    var imageBody = (<div/>);
    var images = [];
    if(!_.isEmpty(post.images)) {
      var allImages = post.images;
      for(var key in allImages) {
        var url = post.images[key] + '?w=150&h=150';
        images.push(
          <div className='panel-body-image' key={ key } >
            <Button 
              className="image-thumbnail" 
              style={{backgroundImage: 'url(' + url + ')'}}
              onClick={() => { this.setState({ showImageModal: true }); }}
            />
            <ImageModal 
              allImages={ allImages } 
              index={ key } 
              show={ this.state.showImageModal }
              onHide={() => { this.setState({ showImageModal: false }); }}
            />
          </div>
        );
      }
      imageBody = (
        <div className="panel-body">
          { images }
        </div>
      );
    }

    var ago = timeAgo(Date.parse(post.created));
    var left = (this.props.post.expires && !post.pinned)
    ? (
      <span>
        <span className='middot'>•</span>
        { 'expires ' + timeLeft(Date.parse(post.expires)) }
      </span>
    ) : '';

    if(!_.isEmpty(this.state.title)) {
      var words = this.state.title.split(' ');
      var $words = [];
      var tags = post.tags;
      var urls = _.pluck(post.links, 'url');
      var videos = youtubeRegex.exec(this.state.title);
      words.forEach(function(word) {
        // take off the hashtag
        var tag = word.slice(1, word.length);
        var index = tags.indexOf(tag);
        if(index > -1) {
          return $words.push(<a href={ '/s/' + tag } key={ post._id + index + 'hash'} id={ tag } onClick={ this.onTag }>{ word } </a>);
        }
        // if this word is in the urls array
        if(!_.isEmpty(urls)) {
          index = urls.indexOf(word);
          if(index > -1) {
            return $words.push(<a href={ word } key={ post._id + index } target='_blank'>{ word + ' '}</a>);
          }
        }
        return $words.push(word + ' ');
      }.bind(this));

      // check for youtube videos
      if(!_.isEmpty(videos)) {
        videos.forEach(function(video, index) {
          if((index % 2) == 0) return;
          $words.push(<iframe width="60%" height="200px" src={"https://www.youtube.com/embed/" + video} frameborder="0" allowfullscreen={true}></iframe>);
        });
      }

      var bodyText = (<p>{ $words }</p>);
    } else bodyText = '';

    var panelBodyText;
    if(this.state.isEditing) {
      panelBodyText = (
        <div className='panel-body-text'>
          <TextField
            className='edit-field'
            type='text'
            ref='title'
            multiLine={true}
            defaultValue={ this.state.title  }
            value={ this.state.title  }
            placeholder=' '
            onChange={ this.onChange }
          />
          <RaisedButton
            label='save'
            onClick={ this.stopEdit }
          />
        </div>
      );
    } else {
      panelBodyText = (
        <div className='panel-body-text'>
          { bodyText }
        </div>
      );
    }

    var deleteButton = '';
    if(window.bootstrap.user) {
      if(window.bootstrap.user._id == author._id)
        deleteButton = (
          <MenuItem onClick={ this.destroy } >
            Delete Post
          </MenuItem>
        );
    }

    var editButton = '';
    if(window.bootstrap.user) {
      if(window.bootstrap.user._id == author._id)
        editButton = (
          <MenuItem onClick={ this.startEdit } >
            Edit Post
          </MenuItem>
        );
    }

    var pinButton = '';
    var pinButtonText = (post.pinned) ? 'Unpin Post' : 'Pin Post';
    if(window.bootstrap.user) {
      if(window.bootstrap.user._id == author._id) {
        pinButton = (
          <MenuItem onClick={ this.pin }>
            { pinButtonText }
          </MenuItem>
        );
      }
    }

    var muteButtonText = (_.find(post.muted_by, function(muter) { return muter == user._id }))
    ? 'Unmute Post'
    : 'Mute Post';
    var muteButton = (
      <MenuItem onClick={ this.mute }>
        { muteButtonText }
      </MenuItem>
    );

    var pinnedBadge = (post.pinned)
    ? <span className='badge pinned'>Pinned</span>
    : '';

    var styles = this.getCollapsibleClassSet();
    var text = this.isExpanded() ? 'Hide' : 'Show';

    var user_id = (window.bootstrap.user)
    ? window.bootstrap.user._id
    : '';

    var upvoteStyle = (_.find(post.votes, function(vote){ return vote.voter == user_id; }))
    ? {color: 'black'}
    : {};

    var postBody = (
      <div>
        <div className='panel-header'>
          <div className='profile-img' style={{backgroundImage: 'url(' + profileImage + ')',}} />
          <div className='post-details'>
            <div className='top'>
              <span className="details">
                <Button onClick={ this.onOpenThread }>{ authorName }</Button>
              </span>
              <span className="glyphicon glyphicon-triangle-right"/>
              <span className="details">
                <a href={ '/b/' + bevy._id } id={ bevy._id } onClick={ this.onSwitchBevy }>{ bevy.name }</a>
              </span>
            </div>
            <div className="bottom">
              <span className="detail-time">{ ago }</span>
              <span className='detail-time'>{ left }</span>
            </div>
          </div>
          <div className='badges'>
            <DropdownButton
              noCaret
              pullRight
              className="post-settings"
              title={<span className="glyphicon glyphicon-option-vertical btn"></span>}>
              { deleteButton }
              { editButton }
              { pinButton }
              { muteButton }
            </DropdownButton>
          </div>
        </div>

        <div className='panel-body'>
          { panelBodyText }
        </div>

        { imageBody }
        <div className="panel-bottom">
          <div className='left'>
            <FlatButton 
              className='upvote' 
              onClick={ this.upvote } 
              disabled={_.isEmpty(window.bootstrap.user)}
              style={{padding: '0px 8px 0px 8px', marginRight: '10px'}}
            >
              <span className="glyphicon glyphicon-thumbs-up btn" style={upvoteStyle}></span>
              &nbsp;{ this.countVotes() } upvotes
            </FlatButton>
            <FlatButton className='comment' onClick={ this.expandComments } style={{padding: '0px 8px 0px 8px'}}>
              <span className="glyphicon glyphicon-comment btn"></span>
              &nbsp;{ commentCount } comments
            </FlatButton>
          </div>
        </div>
        <CommentPanel expanded={this.state.showComments} post={post} />
        <div className='panel-comment-submit'>
          <CommentSubmit
            postId={ this.props.id }
            author={ post.author }
            bevy={ bevy }
          />
        </div>
      </div>
    );

    var collapsibleDiv = (this.props.post.pinned)
    ? (<div className='collapse-post'>
        <Button className="collapse-button" onClick={this.onHandleToggle}>{text} pinned post</Button>
        <div ref='postBody' className={classNames(styles)}>
          {postBody}
        </div>
      </div>)
    : <div>{postBody}</div>;

    var postClassName = 'post panel';
    if(router.post_id == post._id) postClassName += ' active';

    return  (
      <div className={ postClassName } postId={ post._id } id={ 'post:' + post._id }>
        {collapsibleDiv}
      </div>
    );
  }
});

module.exports = Post;
