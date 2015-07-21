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
var Event = React.createClass({

	propTypes: {
		id: React.PropTypes.string.isRequired,
		post: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			isEditing: false,
			title: this.props.post.title,
			post: this.props.post,
			showComments: false,
		};
	},

	componentWillMount: function() {
		PostStore.on(POST.CHANGE_ONE + this.props.post._id, this._onPostChange);
	},

	componentDidUnmount: function() {
		PostStore.off(POST.CHANGE_ONE + this.props.post._id, this._onPostChange);
	},

	_onPostChange: function() {
		this.setState({
			post: PostStore.getPost(this.props.post._id)
		});
	},

	getCollapsibleDOMNode: function(){
		return React.findDOMNode(this.refs.postBody);
	},

	getCollapsibleDimensionValue: function(){
		return React.findDOMNode(this.refs.postBody).scrollHeight;
	},

	onHandleToggle: function(ev){
    	ev.preventDefault();
    	this.setState({
    		expanded: !this.state.expanded
    	});
	},

	onChange: function(ev) {
		this.setState({
			title: this.refs.title.getValue()
		});
	},

	upvote: function(ev) {
		ev.preventDefault();
		PostActions.upvote(this.props.post._id, window.bootstrap.user);
	},

	destroy: function(ev) {
		ev.preventDefault();
		PostActions.destroy(this.props.post._id);
	},

	/**
	 * count the summed value of all of the votes
	 * for this post
	 * @return {int}
	 */
	countVotes: function() {
		var sum = 0;
		this.state.post.votes.forEach(function(vote) {
			sum += vote.score;
		});
		return sum;
	},

	startEdit: function(ev) {
		ev.preventDefault();

		this.setState({
			isEditing: true
		});
	},

	stopEdit: function(ev) {
		ev.preventDefault();

		var postTitle = this.state.title;

		PostActions.update(this.props.post._id, postTitle);

		this.setState({
			isEditing: false
		});
	},

	mute: function(ev) {
		ev.preventDefault();

		var post_id = this.props.post._id;

		PostActions.mute(post_id);
	},

	onTag: function(ev) {
		ev.preventDefault();
		var tag = ev.target.parentNode.getAttribute('id');

		router.navigate('/s/' + tag, { trigger: true });
	},

	onSwitchBevy: function(ev) {
		ev.preventDefault();
		var bevy_id = ev.target.parentNode.getAttribute('id');

		router.navigate('/b/' + bevy_id, { trigger: true });
	},

	onOpenThread: function(ev) {
		ev.preventDefault();
		var author_id = this.state.post.author._id;
		ChatActions.openThread(null, author_id);
	},

	expandComments: function(ev) {
		ev.preventDefault();
		this.setState({
			showComments: !this.state.showComments
		});
	},

	render: function() {

		var post = this.state.post;
		//console.log(post);
		var bevy = post.bevy;
		var author = post.author;
		var commentCount = (post.allComments)
		?	post.allComments.length
		:   0;

		var defaultProfileImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';
		var profileImage = (post.author.image_url)
		? post.author.image_url
		: defaultProfileImage;

		var authorName;
		authorName = 'placeholder-author';
		if(author) {
			if(!_.isEmpty(author.google.name))
				authorName = author.google.name.givenName + ' ' + author.google.name.familyName;
			else
				authorName = author.email;
		}

		var imageBody = (<div/>);
		var images = [];
		if(!_.isEmpty(post.images)) {
			var allImages = post.images;
			for(var key in allImages) {
				var url = post.images[key] + '?w=150&h=150';
				images.push(
					<div className='panel-body-image' key={ key } >
						<ModalTrigger modal={ <ImageModal allImages={ allImages } index={ key } /> } >
							<button className="image-thumbnail" style={{backgroundImage: 'url(' + url + ')'}}/>
						</ModalTrigger>
					</div>
				);
			}
			imageBody = (
				<div className="panel-body">
					{ images }
				</div>);
		}

		var ago = timeAgo(Date.parse(post.created));
		var left = (this.props.post.expires && !post.pinned)
		? (<span><span className='middot'>•</span>{ 'expires ' + timeLeft(Date.parse(post.expires)) }</span>)
		: '';

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
				</div>);
		} else {
			panelBodyText = (
				<div className='panel-body-text'>
					{ bodyText }
				</div>);
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

		var muteButtonText = (_.find(post.muted_by, function(muter) { return muter == user._id }))
		? 'Unmute Post'
		: 'Mute Post';
		var muteButton = (
			<MenuItem onClick={ this.mute }>
				{ muteButtonText }
			</MenuItem>
		);

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
						<FlatButton className='upvote' onClick={ this.upvote }>
							<span className="glyphicon glyphicon-thumbs-up btn"></span>
							&nbsp;{ this.countVotes() } upvotes
						</FlatButton>
						<FlatButton className='comment' onClick={ this.expandComments }>
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
						activeMember={ activeMember }
						bevy={ bevy }
					/>
				</div>
			</div>
		);

		var postClassName = 'post panel';
		if(router.post_id == post._id) postClassName += ' active';

		return <div className={ postClassName } postId={ post._id } id={ 'post:' + post._id }>
					<div>{postBody}</div>
				</div>;
	}
});

module.exports = Event;
