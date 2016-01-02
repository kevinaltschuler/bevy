/**
 * CreateNewBevy.jsx
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');
var {
  Panel,
  Input,
  Button,
  Modal
} = require('react-bootstrap');
var {
  FlatButton,
  RaisedButton,
  TextField,
  Styles,
  RadioButton
} = require('material-ui');
var ThemeManager = new Styles.ThemeManager();
var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var $ = require('jquery');
var constants = require('./../../constants');
var getSlug = require('speakingurl');
var BevyActions = require('./../BevyActions');
var user = window.bootstrap.user;

var CreateNewBevyModal = React.createClass({
  propTypes: {
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getInitialState() {
    return {
      name: '',
      image: {},
      slug: '',
      slugVerified: true,
      verifyingSlug: false,
      privacy: 'Public'
    };
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  componentWillMount() {
    ThemeManager.setComponentThemes({
      textField: {
        textColor: '#666',
        focusColor: '#666'
      },
      radioButton: {
        borderColor:  '#666',
        backgroundColor: '#fff',
        checkedColor: '#222',
        requiredColor: '#222',
        disabledColor: 'rgba(0,0,0,.2)',
        size: 24,
        labelColor: '#222',
        labelDisabledColor: 'rgba(0,0,0,.2)',
      },
    });
  },

  onUploadComplete(file) {
    this.setState({
      image: file,
    });
  },

  create(ev) {
    ev.preventDefault();

    var name = this.refs.Name.getValue();
    var image = this.state.image;
    var slug = this.state.slug;
    var privacy = this.state.privacy;

    if(_.isEmpty(name)) {
      this.refs.Name.setErrorText('Please enter a name for your bevy');
      return;
    }
    if(!this.state.slugVerified) {
      return;
    }

    BevyActions.create(name, image, slug, privacy);

    // after, close the window
    this.hide();
  },

  hide() {
    this.setState({
      name: '',
      description: '',
      image: {},
      slug: '',
      verifyingSlug: false,
      slugVerified: true
    });
    this.props.onHide();
  },

  onSlugChange() {
    this.setState({
      verifyingSlug: true
    });
    // delay the request until the user stops typing
    // to reduce lag and such
    if(this.slugTimeoutID != undefined) {
      clearTimeout(this.slugTimeoutID);
      delete this.slugTimeoutID;
    }
    this.slugTimeoutID = setTimeout(this.verifySlug, 500);
  },

  verifySlug() {
    fetch(constants.apiurl + '/bevies/' + this.state.slug + '/verify', {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      if(res.found) {
        this.setState({
          slugVerified: false,
          verifyingSlug: false
        });
      } else {
        this.setState({
          slugVerified: true,
          verifyingSlug: false
        });
      }
    })
    .catch(err => {
      this.setState({
        verifyingSlug: false
      });
    });
  },

  _renderSlugVerifyStatus() {
    if(_.isEmpty(this.state.slug)) return <div />;
    if(this.state.verifyingSlug) {
      // loading indicator
      return (
        <section className="loaders small">
          <span className="loader small loader-quart"> </span>
        </section>
      );
    }
    if(this.state.slugVerified) {
      // all good
      return <span className='glyphicon glyphicon-ok'/>
    } else {
      // not good
      return <span className='glyphicon glyphicon-remove' />
    }
  },

  render() {
    var dropzoneOptions = {
      maxFiles: 1,
      acceptedFiles: 'image/*',
      clickable: '.dropzone-panel-button',
      dictDefaultMessage: ' ',
      init: function() {
        this.on("addedfile", function() {
          if (this.files[1]!=null){
            this.removeFile(this.files[0]);
          }
        });
      }
    };
    var bevyImageURL = (_.isEmpty(this.state.image))
      ? constants.siteurl + '/img/default_group_img.png'
      : (this.state.image.foreign)
        ? this.state.image.filename
        : constants.apiurl + '/files/' + this.state.image.filename;
    var bevyImageStyle = {
      backgroundImage: 'url(' + bevyImageURL + ')',
      backgroundSize: '100% auto'
    };

    return (
      <Modal show={ this.props.show } onHide={ this.hide } className="create-bevy">
        <Modal.Header closeButton>
          <Modal.Title>Create a New Bevy</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bevy-info">
          <div className="new-bevy-picture">
            <Uploader
              onUploadComplete={ this.onUploadComplete }
              className="bevy-image-dropzone"
              style={ bevyImageStyle }
              dropzoneOptions={ dropzoneOptions }
            />
          </div>
          <div className='text-fields'>
            <TextField
              type='text'
              ref='Name'
              placeholder='Group Name'
              onChange={() => {
                this.setState({
                  slug: getSlug(this.refs.Name.getValue())
                });
                this.onSlugChange();
              }}
            />
            <div className='slug'>
              <TextField
                type='text'
                ref='Slug'
                floatingLabelText='Bevy URL'
                errorText={ (this.state.slugVerified) ? '' : 'URL taken' }
                value={ constants.siteurl + '/b/' + this.state.slug }
                onChange={() => {
                  this.setState({
                    slug: this.refs.Slug.getValue().slice((constants.siteurl.length + 3))
                  });
                  this.onSlugChange();
                }}
                onBlur={() => {
                  this.setState({
                    slug: getSlug(this.refs.Slug.getValue().slice((constants.siteurl.length + 3)))
                  });
                }}
                style={{
                  flex: 1
                }}
              />
              <div className='verify-status'>
                { this._renderSlugVerifyStatus() }
              </div>
            </div>
            <div className='type-buttons'>
              <div className='section-title'>
                Privacy
              </div>
              <div className='type' onClick={() => this.setState({privacy: 'Public' })}>
                <div className='type-title'>
                  <RadioButton
                    label=""
                    style={{width: 15, marginRight: -10}}
                    checked={this.state.privacy == 'Public'}
                  />
                  <i className="material-icons">public</i>
                  Public
                </div>
                <div className='type-description'>
                  Everyone can view, post, and join this Bevy
                </div>
              </div>
              <div className='type' onClick={() => this.setState({privacy: 'Private' })}>
                <div className='type-title'>
                  <RadioButton
                    label=""
                    style={{width: 15, marginRight: -10}}
                    checked={this.state.privacy == 'Private'}
                  />
                  <i className="material-icons">lock</i>
                  Private
                </div>
                <div className='type-description'>
                  Nobody can view this Bevy without admin approval or invitation
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="panel-bottom">
          <FlatButton
            onClick={ this.hide }
            label="Cancel"
          />
          <RaisedButton
            onClick={ this.create }
            label="Create"
            style={{ marginLeft: '10px' }}
            disabled={ !this.state.slugVerified }
          />
        </Modal.Footer>
      </Modal>
    );
  }
});

CreateNewBevyModal.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = CreateNewBevyModal;
