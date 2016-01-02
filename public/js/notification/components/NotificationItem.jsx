/**
 * NotificationItem.jsx
 *
 * @author KEVIN
 * @author albert
 */

var React = require('react');
var $ = require('jquery');
var _ = require('underscore');
var Ink = require('react-ink');

var router = require('./../../router');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;
var Button = rbs.Button;
var Panel = rbs.Panel;

var mui = require('material-ui');
var IconButton = mui.IconButton;

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

  join(ev) {
    ev.preventDefault();

    var data = this.props.data;
    var bevy_id = data.bevy_id;
    var email = user.email;

    NotificationActions.read(this.props.id);
    BevyActions.join(bevy_id, window.bootstrap.user, email);
    //BevyActions.switchBevy();
  },

  acceptJoin(ev) {
    ev.preventDefault();
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
      case 'invite:email':
        //var bevy = data.bevy;
        //var from_user = data.from_user;
        var bevy_name = data.bevy_name;
        var bevy_img = data.bevy_img;
        var inviter_name = data.inviter_name;
        console.log(data);

        var imgStyle = (bevy_img == undefined)
        ? {display: 'none'}
        : {
          backgroundImage: 'url(' + bevy_img + ')',
        };

        body = (
          <Button className="notification-body">
            <div className="sidebar-picture" style={imgStyle}/>
            <div className=" notification-text-col">
              <div className="notification-text">
                <div className="name">
                  { inviter_name }
                </div>
              </div>
              <div className="notification-text">
                <div className="content">
                  Invite to { bevy_name }
                </div>
              </div>
            </div>
            <Button
              className="accept-btn"
              onClick={ this.join } >
              Join
            </Button>
          </Button>
        );

        break;

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
            href={ '/b/' + bevy_id + '/post/' + post_id }
            className="notification-body"
            onClick={ goToPost }
          >
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

      case 'bevy:requestjoin':
        var user_id = data.user_id;
        var user_name = data.user_name;
        var user_image = data.user_image;
        var bevy_id = data.bevy_id;
        var bevy_name = data.bevy_name;
        var imgStyle = (user_image == undefined)
        ? { display: 'none' }
        : { backgroundImage: 'url(' + user_image.path + ')' };

        body = (
          <div className='notification-body'>
            <div className=' sidebar-picture' style={imgStyle}/>
            <div className=' notification-text-col'>
              <div className='row'>
                <span>Request to join <b>{ bevy_name }</b></span>
              </div>
              <div className='row'>
                <span>From <i>{ user_name }</i></span>
              </div>
            </div>
            <Button
              className="accept-btn"
              style={{position: 'relative'}}
              onClick={ this.dismiss } >
              Dismiss
              <Ink style={{ color: '#aaa', width: '85px', height: '100%'}}/>
            </Button>
            <Button
              className="accept-btn"
              style={{position: 'relative'}}
              onClick={ this.acceptJoin } >
              Accept
              <Ink style={{ color: '#aaa', width: '85px', height: '100%'}}/>
            </Button>
          </div>
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
      <Panel className="notification-item" style={itemStyle}>
        { body }

      </Panel>
    );
  }
});
module.exports = NotificationItem;
