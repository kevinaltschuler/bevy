'use strict';

// imports
var React = require('react');

var mui = require('material-ui');
var IconButton = mui.IconButton;

var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');
var PostSubmit = require('./PostSubmit.jsx');

var Input = require('react-bootstrap').Input;


// React class
var Post = React.createClass({


	render: function() {

		return	<div className="panel" postId={ this.state.id }>
						<Input type="text" placeholder="Title" />
	  					<Input type="textarea" placeholder="Body"/>
						<div className="panel-bottom">
							<div className="panel-controls-right">
								<IconButton iconClassName="glyphicon glyphicon-plus" tooltip="attach media"/>
								<IconButton iconClassName="glyphicon glyphicon-send" tooltip="Post" onClick={PostSubmit.submit}/>
							</div>
						</div>
					</div>
			}
		});
