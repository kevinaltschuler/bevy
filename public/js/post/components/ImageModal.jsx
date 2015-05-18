/**
 * ImageModal.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Modal = rbs.Modal;
var Button = rbs.Button;

var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;

var ImageModal = React.createClass({

	propTypes: {
		url: React.PropTypes.string,
	},

	getInitialState: function() {
	    return {
	      isModalOpen: false
	    };
 	},

 	// triggered every time a key is pressed
	// updates the state
	handleChange: function() {
	},

	render: function() {

		return <Modal
				  {...this.props}
				  title=" "
			      backdrop={false}
			      className="image-modal">
			      <div className='modal-body'>
			        <img src={ this.props.url }/>
			      </div>
			    </Modal>
	}
});

module.exports = ImageModal;
