/**
 * CommentPanel.jsx
 *
 * @author kev diggity dog
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var classNames = require('classnames');

var CommentList = require('./CommentList.jsx');
var rbs = require('react-bootstrap');
var Button = rbs.Button;
var CollapsibleMixin = rbs.CollapsibleMixin;

var CommentPanel = React.createClass({
	mixins: [CollapsibleMixin],

	propTypes: {
		post: React.PropTypes.object,
		expanded: React.PropTypes.bool
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			expanded: nextProps.expanded
		});
	},

	getCollapsibleDOMNode: function(){
    	return React.findDOMNode(this.refs.panel);
  	},

 	getCollapsibleDimensionValue: function(){
    	return React.findDOMNode(this.refs.panel).scrollHeight;
  	},

  	onHandleToggle: function(ev){
    	ev.preventDefault();
    	this.setState({expanded:!this.state.expanded});
  	},

	render: function() {

		//console.log(this.state.expanded);

		var post = this.props.post;
		var commentList = (post.comments)
		? (<CommentList
				comments={ post.comments }
				post={ post }
			/>)
		: '';

		var styles = this.getCollapsibleClassSet();

		return (<div className='panel-comments'>
					<div ref='panel' className={classNames(styles)}>
						{ commentList }
					</div>
				</div>);
	}

});

module.exports = CommentPanel;
