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
  Styles
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
      description: '',
      image: {},
      slug: '',
      slugVerified: true,
      verifyingSlug: false
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
      }
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
    //var description = this.refs.Description.getValue();
    var image = this.state.image;
    var slug = this.state.slug;

    if(_.isEmpty(name)) {
      this.refs.Name.setErrorText('Please enter a name for your bevy');
      return;
    }
    if(!this.state.slugVerified) {
      return;
    }

    BevyActions.create(name, image, slug);

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
    // send the request
    $.ajax({
      url: constants.apiurl + '/bevies/' + this.state.slug + '/verify',
      method: 'GET',
      success: function(data) {
        if(data.found) {
          console.log('found');
          this.setState({
            slugVerified: false,
            verifyingSlug: false
          });
        } else {
          console.log('not found');
          this.setState({
            slugVerified: true,
            verifyingSlug: false
          });
        }
      }.bind(this),
      error: function(error) {
        console.log(error);
        this.setState({
          verifyingSlug: false
        });
      }.bind(this)
    })
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
      ? '/img/default_group_img.png'
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
            {/*<TextField
              type='text'
              ref='Description'
              placeholder='Group Description'
              multiLine={true}
            />*/}
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
