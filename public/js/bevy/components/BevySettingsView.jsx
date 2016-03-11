/**
 * BevySettingsView.jsx
 *
 * view to change the settings of a bevy
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  OverlayTrigger,
  Popover,
  Input
} = require('react-bootstrap');
var {
  FlatButton,
  RaisedButton
} = require('material-ui');
var Uploader = require('./../../shared/components/Uploader.jsx');
var Ink = require('react-ink');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var getSlug = require('speakingurl');
var resizeImage = require('./../../shared/helpers/resizeImage');

var BevyActions = require('./../../bevy/BevyActions');

var BevySettingsView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      name: this.props.activeBevy.name,
      slug: this.props.activeBevy.slug,
      image: this.props.activeBevy.image,
      posts_expire_in: this.props.activeBevy.settings.posts_expire_in,
      privacy: this.props.activeBevy.settings.privacy,
      verifyingSlug: false,
      slugVerified: true
    };
  },

  onPrivacyChange() {
    var privacy = this.refs.privacy.getValue();
    this.setState({ privacy: privacy });
  },

  onUploadComplete(file) {
    this.setState({ image: file });
  },

  goBack() {
    router.navigate('/', { trigger: true });
  },

  save(ev) {
    BevyActions.update(
      this.props.activeBevy._id,
      this.state.name,
      this.state.slug,
      this.state.image,
      { privacy: this.state.privacy }
    );
    this.goBack();
  },

  destroyBevy(ev) {
    ev.preventDefault();
    if(!confirm('Are you sure? Deleting a bevy will also remove \
    all content posted to that bevy, as well as chats within that bevy.')) {
      return;
    }

    BevyActions.destroy(this.props.activeBevy);
  },

  onSlugChange() {
    this.setState({
      slug: this.refs.SlugInput.getValue(),
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
    if(this.state.slug == this.props.activeBevy.slug) {
      this.setState({
        verifyingSlug: false,
        slugVerified: true
      });
      return;
    }
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

  renderSlugAvailable() {
    if(_.isEmpty(this.state.slug)) return <div />;
    if(this.state.verifyingSlug) {
      // loading indicator
      return (
        <div className='slug-status loading'>
          <section className="loaders small">
            <span className="loader small loader-quart"> </span>
          </section>
          <span className='status'>
            Verifying...
          </span>
        </div>
      );
    }
    if(this.state.slugVerified) {
      // all good
      return (
        <div className='slug-status all-good'>
          <span className='glyphicon glyphicon-ok'/>
          <span className='status'>
            Subdomain available
          </span>
        </div>
      );
    } else {
      // not good
      return (
        <div className='slug-status not-good'>
          <span className='glyphicon glyphicon-remove' />
          <span className='status'>
            Subdomain already taken
          </span>
        </div>
      );
    }
  },

  render() {
    var bevy = this.props.activeBevy;
    var settings = bevy.settings;

    return (
      <div className='bevy-settings-view'>
        <div className='header'>
          <h1 className='title'>
            Settings for <b>{ this.props.activeBevy.name }</b>
          </h1>
        </div>

        <div className='body'>
          <span className='setting-title'>
            Change Bevy Name
          </span>
          <Input
            type='text'
            className='name-input'
            ref={ref => { this.NameInput = ref; }}
            placeholder='Bevy Name'
            value={ this.state.name }
            onChange={() => {
              this.setState({ name: this.NameInput.getValue() });
            }}
           />

           <span className='setting-title'>
            Change Bevy Subdomain
           </span>
           <div className='slug-row'>
             <Input
               type='text'
               className='slug-input'
               ref='SlugInput'
               placeholder='Bevy Subdomain'
               value={ this.state.slug }
               onChange={ this.onSlugChange }
             />
             <span className='domain'>
               { '.' + constants.domain }
             </span>
             { this.renderSlugAvailable() }
           </div>

           <span className='setting-title'>
            Change Bevy Picture
           </span>
           <div className="new-bevy-picture">
             <Uploader
               onUploadComplete={ this.onUploadComplete }
               className="bevy-image-dropzone"
               style={{
                 backgroundImage: 'url(' + resizeImage(this.state.image, 256, 256).url + ')'
               }}
               tooltip='Change Bevy Picture'
               dropzoneOptions={{
                 maxFiles: 1,
                 acceptedFiles: 'image/*',
                 clickable: '.dropzone-panel-button',
                 dictDefaultMessage: ' '
               }}
              />
            </div>

            <span className='setting-title'>
              Change Bevy Preferences
            </span>

            <div className='expire-setting'>
              <span className='expire-title'>Privacy</span>
              <OverlayTrigger placement='right' overlay={
                <Popover id='settingspopover' title='Bevy Privacy'>
                  <p className='warning'>
                    Public bevies can be viewed and joined by anybody. <br /><br />
                    Private bevies are listed publicly but require an invite or permission to join and view content.
                    Public bevies can be viewed and joined by anybody.
                  </p>
                </Popover>
              }>
                <span className='glyphicon glyphicon-question-sign' />
              </OverlayTrigger>
              <Input
               ref='privacy'
               type='select'
               className='privacy-dropdown'
               value={ this.state.privacy }
               onChange={ this.onPrivacyChange }
             >
               <option value='Public'>Public</option>
               <option value='Private'>Private</option>
             </Input>
          </div>

          <span className='setting-title'>
            Danger Zone
          </span>
          <button
            className='delete-button'
            title='Delete Bevy'
            onClick={ this.destroyBevy }
          >
            <Ink style={{ color: "#FFF" }}/>
            Delete Bevy
          </button>

          <div className='footer'>
            <FlatButton
              onClick={ this.goBack }
              label='Cancel'
              style={{
                marginRight: 10
              }}
            />
            <RaisedButton
              onClick={ this.save }
              label='Save'
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BevySettingsView;
