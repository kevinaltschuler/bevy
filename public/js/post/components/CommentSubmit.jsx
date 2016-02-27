/**
 * CommentSubmit.jsx
 *
 * Component for posting a comment to a post
 * also used for replying to another comment
 *
 * @author albert
 */

'use strict';

var React = require('react');
var {
  Input
} = require('react-bootstrap');
var {
  TextField,
  RaisedButton,
  FlatButton
} = require('material-ui');
var Ink = require('react-ink');

var _ = require('underscore');
var constants = require('./../../constants');
var resizeImage = require('./../../shared/helpers/resizeImage');

var CommentActions = require('./../CommentActions');

var CommentSubmit = React.createClass({
  propTypes: {
    postId: React.PropTypes.string,
    commentId: React.PropTypes.string,
    author: React.PropTypes.object,
    onReply: React.PropTypes.func,
    expandComments: React.PropTypes.func,
    showComments: React.PropTypes.bool
  },

  getInitialState() {
    return {
      body: ''
    };
  },

  componentDidMount() {
    // if someone is replying to a comment, they need to press the reply
    // button first.
    // so if that is pressed, auto focus the newly created comment submit
    if(this.props.commentId != undefined) {
      this.refs.body.getInputDOMNode().focus();
    }
  },

  submit() {
    var post_id = this.props.postId;
    var comment_id = this.props.commentId;
    var author = window.bootstrap.user;

    var body = this.refs.body.getValue();
    if(body.length <= 0) return;

    if(comment_id)  // replying to a post
      CommentActions.create(post_id, author, body, comment_id);
    else // replying to a comment
      CommentActions.create(post_id, author, body);

    // clear text field
    this.setState({ body: '' });

    if(this.props.onReply)
      this.props.onReply();

    if(!this.props.showComments && this.props.expandComments)
      this.props.expandComments();
  },

  onKeyPress(ev) {
    if(this.state.body.length <= 0) return;
    if(ev.which == 13) {
      // the enter button was pressed
      this.submit();
    }
  },

  onChange() {
    var body = this.refs.body.getValue();
    this.setState({ body: body });
  },

  render() {
    return (
      <div className='comment-submit'>
        <div
          className='profile-picture'
          style={{
            backgroundImage: 'url(' + resizeImage(window.bootstrap.user.image, 128, 128).url + ')',
            marginLeft: (this.props.commentId == undefined) ? 0 : 15
          }}
        />
        <Input
          ref='body'
          type='text'
          placeholder='Write a comment...'
          value={ this.state.body }
          onChange={ this.onChange }
          onKeyPress={ this.onKeyPress }
          style={{
            height: (this.props.commentId == undefined) ? 32 : 26
          }}
        />
        {/*<TextField
          className="panel-comment-textfield"
          hintText="Write a Comment"
          ref='body'
          style={{width: '75%'}}
          multiLine={ true }
          value={ this.state.body }
          onKeyPress={ this.onKeyPress }
          onChange={ this.onChange }
          underlineFocusStyle={{borderColor: '#666'}}
        />*/}
      </div>
    );
  }
});

module.exports = CommentSubmit;
