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
var constants = require('./../../constants');
var getSlug = require('speakingurl');
var BevyActions = require('./../BevyActions');
var user = window.bootstrap.user;

var CreateBevyPage = React.createClass({
  propTypes: {
  },

  getInitialState() {
    return {
      name: '',
      image: {},
      slug: '',
      slugVerified: true,
      verifyingSlug: false,
      privacy: 'Public',
      slide: 0
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
        checkedColor: '#666',
        requiredColor: '#666',
        disabledColor: 'rgba(0,0,0,.7)',
        size: 24,
        labelColor: '#666',
        labelDisabledColor: 'rgba(0,0,0,.7)',
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

  _onNext() {
    this.setState({
      slide: this.state.slide + 1
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

  _renderContent() {

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
      backgroundSize: '100% auto',
      borderRadius: 5
    };

    var content = <div/>;

    console.log(this.state.slide);

    switch(this.state.slide) {
      case 0:
        content = (
          <div className='bevy-info'>
            <div className='title'>
              Customize your bevy's Picture & choose a name
            </div>
            <div className="new-bevy-picture">
              <Uploader
                onUploadComplete={ this.onUploadComplete }
                className="bevy-image-dropzone"
                style={ bevyImageStyle }
                dropzoneOptions={ dropzoneOptions }
                tooltip='Upload Bevy Picture'
              />
            </div>
            <TextField
              type='text'
              ref='Name'
              fullWidth={true}
              placeholder='Group Name'
              onChange={() => {
                this.setState({
                  slug: getSlug(this.refs.Name.getValue())
                });
                this.onSlugChange();
              }}
            />
          </div>
        )
        break;
      case 1:
        content = ( 
          <div className='bevy-info'>
            <div className='text-fields'>
              <div className='title'>
                Web Presence
              </div>
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
          </div>
        )
        break;
    }
    return content;
  },

  render() {

    return (
      <div className="create-bevy-panel">
        <div className='left'>
          <div className='header'>
            <img style={{width: 40, height: 40}} src='./../../../img/logo_200.png'/>
            <div className='header-text'>
              Bevy
            </div>
          </div>
          { this._renderContent() }
          <div className="panel-bottom">
            <RaisedButton
              onClick={ this._onNext }
              label="Next"
              style={{ marginLeft: '10px' }}
              disabled={ !this.state.slugVerified }
            />
          </div>
        </div>
        <div className='right'>
        </div>
      </div>
    );
  }
});

CreateBevyPage.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = CreateBevyPage;
