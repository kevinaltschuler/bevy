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
var BEVY = constants.BEVY;
var getSlug = require('speakingurl');
var BevyActions = require('./../BevyActions');
var BevyStore = require('./../BevyStore');
var user = window.bootstrap.user;

var fakeUsers = constants.fakeUsers;

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
      verifyError: '',
      privacy: 'Public',
      slide: 0,
      slides: 3,
      inviteRefs: ['Invite1', 'Invite2'],
      username: '',
      password: '',
      email: '',
      error: ''
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

    BevyStore.on(BEVY.CREATE_SUCCESS, this.onCreateSuccess);
    BevyStore.on(BEVY.CREATE_ERR, this.onCreateError);
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.CREATE_SUCCESS, this.onCreateSuccess);
    BevyStore.off(BEVY.CREATE_ERR, this.onCreateError);
  },

  onCreateError(err) {
    this.setState({
      slide: 4,
      error: err
    });
  },

  onCreateSuccess(res) {
    this.setState({ slide: 3 });
  },

  onUploadComplete(file) {
    this.setState({ image: file });
  },

  create(ev) {
    ev.preventDefault();

    var bevyName = this.state.name;
    var bevyImage = this.state.image;
    var bevySlug = this.state.slug;
    var adminEmail = this.state.email;
    var adminName = this.state.username;
    var inviteEmails = [];
    for(var key in this.state.inviteRefs) {
      var ref = this.state.inviteRefs[key];
      var textInput = this.refs[ref];
      inviteEmails.push(textInput.getValue());
    }

    // create bevy, account and invite users
    //create(bevyName, bevyImage, bevySlug, adminEmail, adminName, adminPass, inviteEmails)
    BevyActions.create(bevyName, bevyImage, bevySlug, adminEmail, adminName, inviteEmails);
  },

  registerFinish(username, email) {
    this.setState({
      username: username,
      email: email
    });
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

  onSlugChange(slug) {
    if(_.isEmpty(slug)) {
      this.setState({
        slug: '',
        verifyingSlug: false,
        slugVerified: false,
        verifyError: '',
      });
      return;
    }
    this.setState({
      verifyingSlug: true,
      slug: slug
    });
    // delay the request until the user stops typing
    // to reduce lag and such
    if(this.slugTimeoutID != undefined) {
      clearTimeout(this.slugTimeoutID);
      delete this.slugTimeoutID;
    }
    this.slugTimeoutID = setTimeout(this.verifySlug, 250);
  },

  verifySlug() {
    fetch(constants.apiurl + '/bevies/' + this.state.slug + '/verify', {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      if(!_.isObject(res)) {
        this.setState({
          slugVerified: false,
          verifyingSlug: false,
          verifyError: res
        });
        return;
      }
      if(res.found) {
        this.setState({
          slugVerified: false,
          verifyingSlug: false,
          verifyError: ''
        });
      } else {
        this.setState({
          slugVerified: true,
          verifyingSlug: false,
          verifyError: ''
        });
      }
    })
    .catch(err => {
      console.log('got to here');
      this.setState({
        slugVerified: false,
        verifyingSlug: false,
        verifyError: err
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
    var dots = [];
    for(var i = 0; i < this.state.slides; i++) {
      dots.push(
        <div
          key={ 'dot:' + i }
          className='dot'
          style={{
            backgroundColor: (this.state.slide == i) ? '#aaa' : 'rgba(0,0,0,.1)',
          }}
        />
      )
    }
    return (
      <div className='dotsContainer'>
        { dots }
      </div>
    );
  },

  _renderInviteOthers() {
    var inviteInputs = [];
    for(var i = 0; i < this.state.inviteRefs.length; i++) {
      inviteInputs.push(
        <TextField
          key={ 'invite:' + i }
          ref={ this.state.inviteRefs[i] }
          type='text'
          style={{ width: '60%' }}
          hintText={ 'e.g., ' + fakeUsers[Math.floor(Math.random()*fakeUsers.length)].email }
        />
      )
    }
    inviteInputs.push(
      <div
        className='new-invite-button'
        onClick={() => {
          var inviteRefs = this.state.inviteRefs;
          inviteRefs.push('Invite' + (inviteRefs.length + 1));
          this.setState({
            inviteRefs: inviteRefs
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

    return (
      <div className='invites'>
        { inviteInputs }
      </div>
    );
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
      borderRadius: 5,
      marginTop: -10
    };

    var content = <div/>;

    switch(this.state.slide) {
      case 0:
        content = (
          <div className='bevy-info'>
            <div className='title'>
              Customize your Bevy's details
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
              fullWidth={ true }
              floatingLabelText='Group Name'
              value={ this.state.name }
              onChange={() => {
                var name = this.refs.Name.getValue();
                if(name.length > 40)
                  name = name.subString(0,40);
                this.setState({
                  name: name
                });
                this.onSlugChange(getSlug(this.refs.Name.getValue()));
              }}
            />
            <div className='slug'>
              <div
                className='verify-status'
                style={{ width: (this.state.slug) ? 60 : 0 }}
              >
                { this._renderSlugVerifyStatus() }
              </div>
              <TextField
                type='text'
                ref='Slug'
                fullWidth={ true }
                floatingLabelText={(this.state.slug)
                  ? this.state.slug + '.joinbevy.com'
                  : "Your Bevy's URL"
                }
                errorText={ (_.isEmpty(this.state.verifyError))
                  ? (_.isEmpty(this.state.slug))
                    ? ''
                    : (this.state.slugVerified) ? '' : 'URL taken'
                  : this.state.verifyError
                }
                value={ this.state.slug }
                onChange={() => {
                  var slug = getSlug(this.refs.Slug.getValue());
                  if(slug.length > 40)
                    slug = slug.subString(0,40);
                  this.onSlugChange(slug);
                }}
                onBlur={() => {
                  this.setState({ slug: getSlug(this.refs.Slug.getValue()) });
                }}
                style={{
                  flex: 1,
                  marginTop: 0,
                  marginBottom: 0,
                  paddingTop: 0
                }}
                floatingLabelStyle={{
                  lineHeight: '14px'
                }}
              />
            </div>
            <div className="panel-bottom">
              <RaisedButton
                onClick={ this._onNext }
                label="Next"
                style={{ marginLeft: '10px' }}
                disabled={ !this.state.name || !this.state.image || !this.state.slugVerified }
              />
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
            <RegisterInputs
              _onBack={ this._onBack }
              _onNext={ this._onNext }
              registerFinish={ this.registerFinish }
              username={ this.state.username }
              password={ this.state.password }
              email={ this.state.email }
            />
            { this._renderDots() }
          </div>
        )
        break;
      case 2:
        content = (
          <div className='bevy-info'>
            <div className='title'>
              Invite Others to your Bevy!
            </div>
            { this._renderInviteOthers() }
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20, minHeight: 100}}>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <FlatButton
                  onClick={ this._onBack }
                  label='Back'
                />
                <RaisedButton
                  onClick={ this.create }
                  label="Create Bevy"
                  style={{ marginLeft: '10px' }}
                />
              </div>
              { this._renderDots() }
            </div>
          </div>
        )
        break;
      case 3:
        content = (
          <div className='bevy-info'>
            <div className='title'>
              Check Your Email To Finish Creating Your Bevy!
            </div>
          </div>
        );
        break;
      case 4:
        content = (
          <div className='bevy-info'>
            <div className='title'>
              { this.state.error }
            </div>
          </div>
        );
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
      <div className="create-bevy-page">
        <div className='left'>
          <a
            href='/'
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
              className='login-btn'
              title='Login'
              href='/signin'
            >
              <Ink />
              Log In
            </a>
          </div>
          <div className='image-container'>
            <div className='group-title'>
              {this.state.name || 'Your Bevy Name'}
            </div>
            <div className='bevy-image'>
              <div style={ bevyImageStyle }/>
            </div>
            <img
              src='./../img/bevysimple.png'
              className='bevy-simple'
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
