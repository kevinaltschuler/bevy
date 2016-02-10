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
  RadioButton,
  IconButton
} = require('material-ui');
var ThemeManager = new Styles.ThemeManager();
var Uploader = require('./../../shared/components/Uploader.jsx');
var Ink = require('react-ink');

var RegisterInputs = require('./../../auth/components/RegisterInputs.jsx');

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
      slide: 0,
      slides: 3,
      invites: ['', '']
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

  setUserDetails(details) {
    this.setState(details);
  },

  _onNext() {
    this.setState({
      slide: this.state.slide + 1
    })
  },

  _onBack() {
    this.setState({
      slide: this.state.slide - 1
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

  _renderDots() {
    var dots =[];

    for(var i = 0; i < this.state.slides; i++) {
      dots.push(
        <div 
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: (this.state.slide == i) ? '#aaa' : 'rgba(0,0,0,.1)',
            margin: 10,
            justifyContent: 'center',
            alignSelf: 'center'
          }}
        />
      )
    }

    return (
      <div style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
        {dots}
      </div>
    );
  },

  _renderInviteOthers() {
    var inviteInputs = [];
    for(var key in this.state.invites) {
      inviteInputs.push(
        <TextField
          ref={'Invite:' + key}
          type='text'
          fullWidth={true}
          style={{
            flex: 1
          }}
          hintText='johndoe@example.com'
        />
      )
    }
    inviteInputs.push(
      <div 
        className='new-invite-button'
        onClick={() => {
          var invites = this.state.invites;
          invites.push('');
          this.setState({
            invites: invites
          })
        }}
      >
        <i className="material-icons">add</i>
        <Ink 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: 2
          }} 
        />
      </div>
    );
    return <div className='invites'>
        {inviteInputs}
      </div>;
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
              Customize your Bevy's Picture, Name & URL
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
                  name: this.refs.Name.getValue(),
                  slug: getSlug(this.refs.Name.getValue())
                });
                this.onSlugChange();
              }}
            />
            <div className='slug'>
              <div 
                className='verify-status'
                style={{width: (this.state.slug) ? 60 : 0}}
              >
                { this._renderSlugVerifyStatus() }
              </div>
              <TextField
                type='text'
                ref='Slug'
                fullWidth={true}
                floatingLabelText={(this.state.slug) ? this.state.slug + '.joinbevy.com' : "Your Bevy's URL"}
                errorText={ (this.state.slugVerified) ? '' : 'URL taken' }
                value={ this.state.slug }
                onChange={() => {
                  this.setState({
                    slug: this.refs.Slug.getValue()
                  });
                  this.onSlugChange();
                }}
                onBlur={() => {
                  this.setState({
                    slug: getSlug(this.refs.Slug.getValue())
                  });
                }}
                style={{
                  flex: 1
                }}
              />
            </div>
            <div className="panel-bottom">
              <div>
                <RaisedButton
                  onClick={ this._onNext }
                  label="Next"
                  style={{ marginLeft: '10px' }}
                  disabled={ !this.state.name || !this.state.image }
                />
              </div>
              { this._renderDots() }
            </div>
          </div>
        )
        break;
      case 1:
        content = ( 
          <div className='bevy-info'>
            <div className='text-fields'>
              <div className='title'>
                Choose your account details
              </div>
            </div>
            <RegisterInputs _onBack={this._onBack} _onNext={this._onNext} />
            { this._renderDots() }
          </div>
        )
        break;
      case 2:
        content = ( 
          <div className='bevy-info'>
            <div className='text-fields'>
              <div className='title'>
                Invite Others to your Bevy!
              </div>
            </div>
            { this._renderInviteOthers() }
            <div className="panel-bottom">
              <div>
                <FlatButton
                  onClick={ this._onBack }
                  label='Back'
                />
                <RaisedButton
                  onClick={ this._onNext }
                  label="Create Your Bevy"
                  style={{ marginLeft: '10px' }}
                  disabled={ !this.state.slugVerified }
                />
              </div>
              { this._renderDots() }
            </div>
          </div>
        )
        break;
    }
    return content;
  },

  render() {

    var bevyImageURL = (_.isEmpty(this.state.image))
      ? constants.siteurl + '/img/default_group_img.png'
      : (this.state.image.foreign)
        ? this.state.image.filename
        : constants.apiurl + '/files/' + this.state.image.filename;
    var bevyImageStyle = {
      backgroundImage: 'url(' + bevyImageURL + ')',
      backgroundSize: '100% auto',
      width: '100%',
      height: 67,
    };

    return (
      <div className="create-bevy-panel">
        <div className='left'>
          <a 
            href='/home'
            className='header'
          >
            <img style={{width: 40, height: 40}} src='./../../../img/logo_200.png'/>
            <div className='header-text'>
              Bevy
            </div>
          </a>
          { this._renderContent() }
        </div>
        <div className='right'>
          <div className='right-header'>
            Already part of an existing bevy?
            <a
              className="login-btn"
              title='Login'
              href='/login'
            >
              <Ink 
                style={{
                  position: 'absolute',

                }}
              />
              Log In
            </a>
          </div>
          <div className='image-container'>
            <div className='group-title'>
              {this.state.name || 'Bevy'}
            </div>
            <div style={{
              backgroundColor: 'rgba(0,0,0,.1)',
              position: 'absolute',
              zIndex: 0,
              top: 25,
              height: 67,
              width: '100%'
            }}>
              <div style={bevyImageStyle}/>
            </div>
            <img 
              src='./../img/bevysimple.png'
              style={{
                width: 800,
                height: 469,
                position: 'absolute',
                borderRadius: 10
              }}
            />
          </div>
        </div>
      </div>
    );
  }
});

CreateBevyPage.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = CreateBevyPage;
