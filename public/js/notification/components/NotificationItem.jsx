/**
 * NotificationItem.jsx
 *
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  ButtonGroup,
  Button,
  Panel
} = require('react-bootstrap');
var {
  IconButton
} = require('material-ui');
var Ink = require('react-ink');

var _ = require('underscore');
var $ = require('jquery');
var router = require('./../../router');
var NotificationActions = require('./../NotificationActions');
var BevyActions = require('./../../bevy/BevyActions');
var timeAgo = require('./../../shared/helpers/timeAgo');
var user = window.bootstrap.user;

var NotificationItem = React.createClass({
  propTypes: {
    id: React.PropTypes.string,
    event: React.PropTypes.string,
    data: React.PropTypes.object,
    read: React.PropTypes.bool
  },

  dismiss(ev) {
    ev.preventDefault();
    NotificationActions.dismiss(this.props.id);
  },

  render() {
    var event = this.props.event;
    var data = this.props.data;
    var read = this.props.read;
    var id = this.props.id;
    var itemStyle = (read)
    ? {}
    : {
      position: 'relative',
      boxShadow: 'none',
      paddingLeft: '5px'
    };

    var body;
    switch(event) {
      case 'post:create':
        var author_name = data.author_name;
        var author_image = data.author_image;
        var board_id = data.board_id;
        var board_name = data.board_name;
        var post_title = data.post_title;
        var post_id = data.post_id;
        var post_created = data.post_created;
        var imgStyle = (author_image == undefined)
        ? { display: 'none' }
        : { backgroundImage: 'url(' + author_image.path + ')' };

        var goToPost = function(ev) {
          ev.preventDefault();
        }

        body = (
          <Button
            href={ '/boards/' + board_id + '/post/' + post_id }
            className="notification-body"
            onClick={ goToPost }
          >
            <Ink />
            <div className="sidebar-picture" style={ imgStyle }/>
            <div className=" notification-text-col">
              <span>
                <b>{ author_name }</b>
                &nbsp;posted to&nbsp;
                <b>{ board_name }</b>
                &nbsp;-&nbsp;
                { timeAgo(Date.parse(post_created)) }
              </span>
              <br />
              <span>
                <i>{ post_title }</i>
              </span>
            </div>
          </Button>
        );
        break;

      case 'post:reply':
        var author_name = data.author_name;
        var author_image = data.author_image;
        var post_title = data.post_title;
        var board_name = data.board_name;
        var comment_created = data.comment_created;
        var imgStyle = (author_image == undefined)
        ? { display: 'none' }
        : { backgroundImage: 'url(' + author_image.path + ')' };

        body = (
          <Button className='notification-body' >
            <Ink />
            <div className='sidebar-picture' style={ imgStyle }/>
            <div className='notification-text-col'>
              <b>{ author_name }</b>
              <span>&nbsp;replied to your post&nbsp;</span>
              <i>{ post_title }</i>
              <span>&nbsp;in&nbsp;</span>
              <b>{ board_name }</b>
              <span>
                &nbsp;-&nbsp;
                { timeAgo(Date.parse(comment_created)) }
              </span>
            </div>
          </Button>
        );
        break;

      case 'comment:reply':
        var author_name = data.author_name;
        var author_image = data.author_image;
        var imgStyle = (author_image == undefined)
        ? { display: 'none' }
        : { backgroundImage: 'url(' + author_image.path + ')' };
        var parent_comment_body = data.parent_comment_body;
        var board_name = data.board_name;
        var comment_created = data.comment_created;

        body = (
          <Button className='notification-body' >
            <Ink />
            <div className='sidebar-picture' style={ imgStyle }/>
            <div className='notification-text-col'>
              <b>{ author_name }</b>
              <span>&nbsp;replied to your comment&nbsp;</span>
              <i>{ parent_comment_body }</i>
              <span>&nbsp;in&nbsp;</span>
              <b>{ board_name }</b>
              <span>
                &nbsp;-&nbsp;
                { timeAgo(Date.parse(comment_created)) }
              </span>
            </div>
          </Button>
        );
        break;

      default:
        body = (
          <span>{ data }</span>
        );
        break;
    }

    return (
      <Panel className="notification-item" style={ itemStyle }>
        { body }
      </Panel>
    );
  }
});
module.exports = NotificationItem;
