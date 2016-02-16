/**
 * Event.jsx
 * React class for an individual event
 * Created en masse by PostContainer.jsx
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var {
  FlatButton,
  FontIcon,
  RaisedButton,
  TextField
} = require('material-ui');
var {
  DropdownButton,
  MenuItem,
  Button
} = require('react-bootstrap');
var Ink = require('react-ink');
var PostHeader = require('./PostHeader.jsx');
var PostFooter = require('./PostFooter.jsx');

var _ = require('underscore');
var timeAgo = require('./../../shared/helpers/timeAgo');
var timeLeft = require('./../../shared/helpers/timeLeft');
var $ = require('jquery');
var router = require('./../../router');
var constants = require('./../../constants');
var POST = constants.POST;
var user = window.bootstrap.user;
var email = user.email;
var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');
var urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
var youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
var maxTextHeight = 100;

function getPostState(id) {
  return PostStore.getPost(id);
}

var Event = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    post: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      isEditing: false,
      title: this.props.post.title,
      description: this.props.post.event.description,
      post: this.props.post,
      descHeight: 0,
      expanded: false
    };
  },

  componentWillReceiveProps(nextProps) {

  },
  componentWillMount() {
    PostStore.on(POST.CHANGE_ONE + this.props.post._id, this._onPostChange);
  },
  componentDidMount() {
    addthisevent.refresh();

    this.hideExtraText();
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

  hideExtraText() {
    var desc = ReactDOM.findDOMNode(this.refs.Description);
    this.setState({
      descHeight: desc.offsetHeight
    });
  },

  toggleExpanded(ev) {
    ev.preventDefault();
    this.setState({
      expanded: !this.state.expanded
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
    var event = this.props.post.event;
    event.description = this.state.description;
    PostActions.update(this.props.post._id, this.state.title, [], event);
    this.setState({
      isEditing: false
    });
  },

  _renderTitleAndDescription() {
    if(this.state.isEditing) {
      return (
        <div className='top'>
          <TextField
            ref='Title'
            floatingLabelText='Event Title'
            defaultValue={ this.state.title }
            style={{
              width: '100%'
            }}
            onChange={(ev) => {
              this.setState({
                title: this.refs.Title.getValue()
              });
            }}
          />
          <TextField
            ref='Description'
            floatingLabelText='Event Description'
            defaultValue={ this.state.description }
            multiLine={ true }
            style={{
              width: '100%'
            }}
            onChange={(ev) => {
              this.setState({
                description: this.refs.Description.getValue()
              });
            }}
          />
          <RaisedButton
            label='Save'
            onClick={ this.stopEdit }
          />
        </div>
      );
    } else {
      var style = {};
      if(this.state.descHeight > maxTextHeight && !this.state.expanded) {
        style.height = maxTextHeight;
      }

      var expandButton = (this.state.expanded)
        ? (
          <a
            className='expand-btn'
            title='Show Less'
            href='#'
            onClick={ this.toggleExpanded }
          >
            Show Less
          </a>
        ) : (
          <a
            className='expand-btn'
            title='Show More'
            href='#'
            onClick={ this.toggleExpanded }
          >
            Show More
          </a>
        );
      if(this.state.descHeight <= maxTextHeight) expandButton = '';

      return (
        <div className='top'>
          <span className='title'>{ this.state.title }</span>
          <span ref='Description' className='description' style={ style }>{ this.state.description }</span>
          { expandButton }
        </div>
      );
    }
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
    var timeString = ($date)
      ? $date.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute:'2-digit'
      })
      : '';
    var dateTime = ($date) ? $date.toLocaleString() : '';
    var dateTime = dateTime.replace(',', '');

    var profileImage = (post.author.image_url)
    ? post.author.image_url
    : constants.defaultProfileImage;

    var authorName = author.displayName;

    var eventImage = (_.isEmpty(post.images[0]))
      ? '/img/default_group_img.png'
      : constants.apiurl + post.images[0].path;
    var eventImageStyle = {
      backgroundImage: 'url(' + eventImage + ')',
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

    var postClassName = 'post panel event';
    if(router.post_id == post._id) postClassName += ' active';

    return (
      <div className={ postClassName } postId={ post._id } id={ 'post:' + post._id }>
        <div className='event-image' style={eventImageStyle}/>
        <PostHeader post={ post } startEdit={ this.startEdit }/>
        <div className='event-header'>
          <div className='post-details'>
            { this._renderTitleAndDescription() }
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
  }
});

module.exports = Event;
