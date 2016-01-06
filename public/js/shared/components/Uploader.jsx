/**
 * Uploader.jsx
 *
 * Dropzone upload component
 *
 * @author albert
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Dropzone = require('dropzone');
var {
  RaisedButton,
  FloatingActionButton
} = require('material-ui');
var {
  OverlayTrigger,
  Tooltip
} = require('react-bootstrap');

var _ = require('underscore');
var constants = require('./../../constants');
var POST = constants.POST;
var PostStore = require('./../../post/PostStore');

var Uploader = React.createClass({
  propTypes: {
    url: React.PropTypes.string,
    onUploadComplete: React.PropTypes.func,
    onRemovedFile: React.PropTypes.func,
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    dropzoneOptions: React.PropTypes.object,
    tooltip: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      tooltip: 'Upload Picture'
    };
  },

  componentDidMount() {
    // disable dropzone autodiscover
    Dropzone.autoDiscover = false;

    // instantiate dropzone
    var options = this.props.dropzoneOptions;
    options.url = constants.apiurl + '/files';
    this.dropzone = new Dropzone(ReactDOM.findDOMNode(this), options);

    this.dropzone.on('success', function(file, response) {
      this.props.onUploadComplete(response);
    }.bind(this));
    if(this.props.onRemovedFile) {
      this.dropzone.on('removedfile', function(file) {
        this.props.onRemovedFile(file);
      }.bind(this));
    }

    PostStore.on(POST.POSTED_POST, this._onPosted);
    PostStore.on(POST.CANCELED_POST, this._onCanceled);
  },
  componentWillUnmount() {
    // remove files
    this.dropzone.removeAllFiles(true);

    PostStore.off(POST.POSTED_POST, this._onPosted);
    PostStore.off(POST.CANCELED_POST, this._onCanceled);
  },

  onDrop() {

  },

  _onPosted() {
    //console.log('post posted!');
    this.dropzone.removeAllFiles(true);
  },

  _onCanceled() {
    this.dropzone.removeAllFiles(true);
  },

  preventDefault(ev) {
    ev.preventDefault();
  },

  render() {
    var children = this.props.children;

    var className = this.props.className || 'dropzone';

    var div = document.createElement('div');

    var actionButton = '';
    var actionButtonContainer = '';
    if(this.props.className === 'bevy-image-dropzone'
      || this.props.className === 'profile-image-dropzone') {
      actionButton = (
        <button
          className="btn btn-lg dropzone-panel-button"
          title='Upload Image'
          onClick={ this.preventDefault }
        >
          <span className='glyphicon glyphicon-pencil'/>
        </button>
      );
      if(_.isEmpty(this.props.tooltip)) {
        actionButtonContainer = (
          <div className='dropzone-button-container'>
            { actionButton }
          </div>
        );
      } else {
        actionButtonContainer = (
          <OverlayTrigger placement='top' overlay={
            <Tooltip id='uplaodertooltip'>{ this.props.tooltip }</Tooltip>
          }>
            <div className='dropzone-button-container'>
              { actionButton }
            </div>
          </OverlayTrigger>
        );
      }
    }

    var style = this.props.style || {
      width: this.props.size || '100%',
      height: this.props.size || '100%',
      minHeight: 100, };

    return (
      <form className={ className } style={ style } id='uploader' >
        { actionButtonContainer }
      </form>
    );
  }
});

module.exports = Uploader;
