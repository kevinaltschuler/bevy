/**
 * Event.jsx
 * React class for an individual event
 * Created en masse by PostContainer.jsx
 * @author albert
 */

'use strict';

// imports
var React = require('react');
var _ = require('underscore');

var Ink = require('react-ink');

var router = require('./../../router');
var classNames = require('classnames');

var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var FontIcon = mui.FontIcon;

var rbs = require('react-bootstrap');
var DropdownButton = rbs.DropdownButton;
var MenuItem = rbs.MenuItem;
var Button = rbs.Button;

var PostHeader = require('./PostHeader.jsx');
var PostFooter = require('./PostFooter.jsx');

var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');
var ChatActions = require('./../../chat/ChatActions');

var POST = require('./../../constants').POST;

var timeAgo = require('./../../shared/helpers/timeAgo');
var timeLeft = require('./../../shared/helpers/timeLeft');

var $ = require('jquery');

var constants = require('./../../constants');
var user = window.bootstrap.user;
var email = user.email;

var urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
var youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

function getPostState(id) {
  return PostStore.getPost(id);
}

// React class
var Event = React.createClass({

  propTypes: {
    id: React.PropTypes.string.isRequired,
    post: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      isEditing: false,
      title: this.props.post.title,
      post: this.props.post
    };
  },

  componentWillRecieveProps(nextProps) {

  },

  componentWillMount() {
    PostStore.on(POST.CHANGE_ONE + this.props.post._id, this._onPostChange);
  },

  componentDidMount() {
    addthisevent.refresh();
  },

  componentDidUpdate() {
    addthisevent.refresh();
  },

  componentDidUnmount() {
    PostStore.off(POST.CHANGE_ONE + this.props.post._id, this._onPostChange);
  },

  _onPostChange() {
    this.setState({
      post: PostStore.getPost(this.props.post._id)
    });
  },

  onHandleToggle(ev){
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

  vote(ev) {
    ev.preventDefault();
    PostActions.vote(this.props.post._id, window.bootstrap.user);
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

  render() {

    var post = this.state.post;
    var title = post.title;
    var bevy = post.bevy;
    var author = post.author;
    var commentCount = (post.allComments)
    ? post.allComments.length
    :   0;
    var event = post.event;
    var date = event.date;
    var location = event.location;
    var description = (event.description)
    ? event.description
    : '';

    var $date = new Date(date)
    var dateString = ($date) ? $date.toDateString() : '';
    var timeString = ($date) ? $date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}) : '';
    var dateTime = ($date) ? $date.toLocaleString() : '';
    var dateTime = dateTime.replace(',', '');

    var profileImage = (post.author.image_url)
    ? post.author.image_url
    : constants.defaultProfileImage;

    var authorName = author.displayName;

    var eventImage = (_.isEmpty(post.images[0])) ? '/img/default_group_img.png' : this.state.image_url;
    var eventImageStyle = {
      backgroundImage: 'url(' + post.images[0] + ')',
      backgroundSize: '100% auto',
      backgroundPosition: 'center'
    };

    var locationLink = (location) 
    ? 'https://www.google.com/maps/search/' + location.replace(/ /g, '+')
    : 'https://www.google.com/maps';

    var eventLink = (title && date && location)
    ? 'http://www.google.com/calendar/event?action=TEMPLATE&text=' + title.replace(/ /g, '+') + '&dates=' + date + '/' + date +'&details=' + description.replace(/ /g, '+') +'&location=' + location.replace(/ /g, '+') + '&trp=false&sprop=&sprop=name:'
    : 'http://www.google.com/calendar/event';

    var voteButtonStyle = { marginRight: '10px', padding: '0px 10px', color: '#999' };
    var upvoted = _.find(post.votes, function(vote) {
      return (vote.voter == window.bootstrap.user._id && vote.score > 0); 
    });
    if(upvoted) {
      voteButtonStyle.color = '#000'
    }

    var postBody = (
      <div>
        <div className='event-image' style={eventImageStyle}/>
        <PostHeader post={ post } />
        <div className='event-header'>
          <div className='post-details'>
            <div className='top'>
              <span className='title'>{ title }</span>
              <span className='description'>{ description }</span>
            </div>
            <div className="bottom">
              <div title="Add to Calendar" className="addthisevent" style={{paddingTop: '5px', paddingBottom: '5px', marginRight: '10px', minWidth: 180}}>
                  {dateString}<br/>{timeString}
                  <Ink/>
                  <span className="start">{dateTime}</span>
                  <span className="end">{dateTime}</span>
                  <span className="timezone">America/New_York</span>
                  <span className="title">{title}</span>
                  <span className="description">{description}</span>
                  <span className="location">{location}</span>
                  <span className="organizer">{authorName}</span>
                  <span className="all_day_event">false</span>
                  <span className="date_format">MM/DD/YYYY</span>
              </div>
              <FlatButton 
                className='detail-button' 
                href={locationLink} 
                linkButton={true} 
                target="_blank" 
                style={{ marginRight: '10px', padding: '5px 10px 5px 5px', lineHeight: '1.5', maxWidth: 'none', 'flexGrow': 1, wordBreak: 'break-all' }}
              >
                <span className="glyphicon glyphicon-map-marker"/>
                <div className='primary'>
                  {location}
                </div>
              </FlatButton>
            </div>
          </div>
        </div>

        <PostFooter post={ post } />
      </div>
    );

    var postClassName = 'post panel event';
    if(router.post_id == post._id) postClassName += ' active';

    return (
      <div className={ postClassName } postId={ post._id } id={ 'post:' + post._id }>
        <div>{postBody}</div>
      </div>
    );
  }
});

module.exports = Event;
