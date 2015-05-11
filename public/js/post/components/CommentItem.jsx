/**
 * CommentItem.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var timeAgo = require('./../../shared/helpers/timeAgo');

var CommentItem = React.createClass({

	propTypes: {
		index: React.PropTypes.string,
		comment: React.PropTypes.object
	},

	render: function() {

		var defaultAliasImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

		var comment = this.props.comment;
		var author = comment.author;

		return (<div className="row comment">
					<div className='col-xs-12'>
						<img className="profile-img" src={ defaultAliasImage }/>
						<div className="comment-text">
							<div className="comment-title">
								<a className="comment-name">{ author.name }</a>
								<span>&nbsp;</span>
								<text className="detail-time">{ timeAgo(Date.parse(comment.created)) }</text>
							</div>
							<div className="comment-body">{ comment.body }</div>
							<a className="reply-link">reply</a>
						</div>
					</div>
				 </div>)
	}

});

module.exports = CommentItem;
