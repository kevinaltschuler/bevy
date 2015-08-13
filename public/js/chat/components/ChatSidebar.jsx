/**
 * ChatDropdown.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var rbs = require('react-bootstrap');
var Button = rbs.Button;

var ChatActions = require('./../ChatActions');
var ChatStore = require('./../ChatStore');

var mui = require('material-ui');
var TextField = mui.TextField;

var user = window.bootstrap.user;
var email = user.email;

var ChatSidebar = React.createClass({

  propTypes: {
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object
  },

  getInitialState() {
    return {
      isOverlayOpen: false,
    };
  },

    handleToggle(ev) {
      ev.preventDefault();
      this.setState({
        isOverlayOpen: !this.state.isOverlayOpen
      });
    },

  openThread(ev) {
    ev.preventDefault();

    var thread_id = ev.target.getAttribute('id');

    ChatActions.openThread(thread_id);
  },

  openSearchResults() {
    document.getElementById("search-results").style.height = "300px";
  },

  closeSearchResults() {
    document.getElementById("search-results").style.height = "0px";
  },

  render() {

    var threads = [];
    var allThreads = (_.isEmpty(this.props.allThreads)) ? [] : this.props.allThreads;
    for(var key in allThreads) {
      var thread = allThreads[key];
      var bevy = thread.bevy;

      var latestMessage = ChatStore.getLatestMessage(thread._id);
      var message = '';
      if(!_.isEmpty(latestMessage)) {
        if(bevy) {
          var messageAuthor = latestMessage.author.displayName;
          if(latestMessage.author._id == user._id) messageAuthor = 'Me';

          message = (
            <span className='latest-message'>
              { messageAuthor + ': ' + latestMessage.body }
            </span>
          );
        } else {
          var messageAuthor = latestMessage.author.displayName;
          if(latestMessage.author._id == user._id) messageAuthor = 'Me';

          message = (
            <span className='latest-message'>
              { messageAuthor + ': ' + latestMessage.body }
            </span>
          );
        }
      }

      var image_url = (bevy) ? bevy.image_url : '';
      if(_.isEmpty(image_url)) {
        if(bevy) image_url = '/img/logo_100.png';
        else image_url = '/img/user-profile-icon.png';
      }
      var imageStyle = {
        backgroundImage: 'url(' + image_url + ')',
        backgroundSize: 'auto 100%',
        backgroundPosition: 'center'
      };

      threads.push(
        <Button className='conversation-item' key={ 'thread' + thread._id } id={ thread._id } onFocus={ this.openThread }>
          <div className='image' style={imageStyle}/>
          <div className='conversation-details'>
            <span className='bevy-name'>{ name }</span>
            { message }
          </div>
        </Button>
      );
    }

    if(threads.length <= 0) {
      console.log('no threads');
      return <div/>;
    };

    return (
      <div className='chat-sidebar'>
        <div className='conversation-list'>
          <div className='title'>
          </div>
          { threads }
        </div>
        <div className='search-results' id='search-results'>
          <div className='content' >
            <div className='top'>
            </div>
            <div className='results-list'>
            </div>
          </div>
          <div className='topline-wrapper'>
            <div className='topline'/>
          </div>
        </div>
        <div className='chat-actions'>
          <span className='glyphicon glyphicon-search' />
          <TextField onFocus={this.openSearchResults} onBlur={this.closeSearchResults}/>
        </div>
      </div>
    );
  }
});
module.exports = ChatSidebar;
