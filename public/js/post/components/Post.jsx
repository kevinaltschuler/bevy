/**
 * Post.jsx
 * React class for an individual post
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

var rbs = require('react-bootstrap');
var DropdownButton = rbs.DropdownButton;
var MenuItem = rbs.MenuItem;
var ModalTrigger = rbs.ModalTrigger;
var Button = rbs.Button;
var Badge = rbs.Badge;
var CollapsibleMixin = rbs.CollapsibleMixin;

var CommentList = require('./CommentList.jsx');
var CommentSubmit = require('./CommentSubmit.jsx');

var ImageModal  = require('./ImageModal.jsx');

var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');

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
		post: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			isEditing: false,
			title: this.props.post.title,
			post: this.props.post
		};
	},

	/*componentWillReceiveProps: function(nextProps) {
		this.setState({
			post: nextProps.post
		});
	},*/

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

	downvote: function(ev) {
		ev.preventDefault();
		PostActions.downvote(this.props.post._id, window.bootstrap.user);
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

	findMember: function(user_id) {
		var members = this.state.post.bevy.members;
		return _.find(members, function(member) {
			if(_.isEmpty(member.user)) return false;
			return member.user == user_id;
		});
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

	pin: function(ev) {
		ev.preventDefault();

		var post_id = this.props.post._id;

		PostActions.pin(post_id);
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

	render: function() {

		var post = this.state.post;
		var bevy = post.bevy;
		var activeMember = this.findMember(user._id) || {};
		var author = post.author;

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

		var authorMember = this.findMember(post.author._id);
		if(authorMember) {
			if(!_.isEmpty(authorMember.displayName) && bevy.settings.anonymise_users)
				authorName = authorMember.displayName;
			if(bevy.settings.anonymise_users && !_.isEmpty(authorMember.image_url))
				profileImage = authorMember.image_url;
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
						type='text'
						ref='title'
						defaultValue={ this.state.title  }
						value={ this.state.title  }
						placeholder=' '
						onChange={ this.onChange }
					/>
					<IconButton
						className="save-button"
						tooltip='save changes'
						onClick={ this.stopEdit }>
						<span className="glyphicon glyphicon-heart-empty"></span>
					</IconButton>
				</div>);
		} else {
			panelBodyText = (
				<div className='panel-body-text'>
					{ bodyText }
				</div>);
		}

		var commentList = (post.comments)
		? (<CommentList
				comments={ post.comments }
				post={ post }
				activeMember={ activeMember }
			/>)
		: '';

		var commentCount = (post.comments)
		? post.commentCount
		: 0;

		var deleteButton = '';
		if(!_.isEmpty(activeMember)) {
			if(activeMember.role == 'admin' || post.author._id == user._id)
				deleteButton = (
					<MenuItem onClick={ this.destroy } >
						Delete Post
					</MenuItem>
				);
		}

		var editButton = '';
		if(!_.isEmpty(activeMember)) {
			if(activeMember.role == 'admin' || post.author._id == user._id)
				editButton = (
					<MenuItem onClick={ this.startEdit } >
						Edit Post
					</MenuItem>
				);
		}

		var pinButton = '';
		var pinButtonText = (post.pinned) ? 'Unpin Post' : 'Pin Post';
		if(!_.isEmpty(activeMember)) {
			if(activeMember.role == 'admin') {
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

		var postBody = (
			<div>
				<div className='panel-header'>
					<div className='profile-img' style={{backgroundImage: 'url(' + profileImage + ')',}} />
					<div className='post-details'>
						<div className='top'>
							<span className="details">{ authorName }</span>
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
						<div>
							<span className="comment-count"> { commentCount } Comments •&nbsp;</span>
							<span className="points"> { this.countVotes() } Points</span>
						</div>
						<div>
							{ pinnedBadge }
						</div>
					</div>
				</div>

				<div className='panel-body'>
					{ panelBodyText }
				</div>

				{ imageBody }

				<div className="panel-comments">
					{ commentList }
				</div>
				<div className="panel-bottom">

					<CommentSubmit
						postId={ this.props.id }
						author={ post.author }
						activeMember={ activeMember }
						bevy={ bevy }
					/>

					<div className="panel-controls-right">
						<IconButton tooltip='upvote' onClick={ this.upvote }>
							<span className="glyphicon glyphicon-menu-up btn"></span>
						</IconButton>
						<IconButton tooltip='downvote' onClick={ this.downvote }>
							<span className="glyphicon glyphicon-menu-down btn"></span>
						</IconButton>
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

		return <div className="post panel" postId={ post._id }>
					{collapsibleDiv}
				</div>;
	}
});

module.exports = Post;
