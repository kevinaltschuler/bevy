/**
 * BevySettingsModal.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var {
  Modal,
  OverlayTrigger,
  Popover
} = require('react-bootstrap');
var {
  FlatButton,
  RaisedButton,
  Toggle,
  DropDownMenu,
  TextField
} = require('material-ui');
var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var getSlug = require('speakingurl');
var BevyActions = require('./../../bevy/BevyActions');

var BevySettingsModal = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getInitialState() {
    return {
      name: this.props.activeBevy.name,
      image: this.props.activeBevy.image,
      slug: this.props.activeBevy.slug,
      slugVerified: true,
      verifyingSlug: false,
      posts_expire_in: this.props.activeBevy.settings.posts_expire_in,
      privacy: this.props.activeBevy.settings.privacy
    };
  },

  onDropDownChange(ev, selectedIndex, menuItem) {
    ev.preventDefault();
    this.setState({
      posts_expire_in: menuItem.payload
    });
  },

  onPrivacyChange(ev, selectedIndex, menuItem) {
    ev.preventDefault();
    this.setState({
      privacy: menuItem.text
    });
  },

  onHide() {
    this.setState({
      verifyingSlug: false,
      slugVerified: true
    });
    this.props.onHide();
  },

  onUploadComplete(file) {
    this.setState({
      image: file,
    });
  },

  save(ev) {
    BevyActions.update(
      this.props.activeBevy._id,
      this.state.name,
      this.state.image,
      this.state.slug,
      { privacy: this.state.privacy }
    );
    this.props.onHide();
  },

  destroyBevy(ev) {
    ev.preventDefault();
    if(!confirm('Are you sure? Deleting a bevy will also remove '
    + 'all content posted to that bevy, as well as chats within that bevy.'))
      return;

    BevyActions.destroy(this.props.activeBevy);
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
    var bevy = this.props.activeBevy;
    var settings = bevy.settings;

    var privacyMenuItems = [
      { payload: '0', text: 'Public', defaultIndex: 0 },
      { payload: '1', text: 'Private', defaultIndex: 1 }
    ];
    var privacyIndex = (this.state.privacy == 'Private') ? 1 : 0;

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
      <Modal
        className="bevy-settings-modal"
        show={ this.props.show }
        onHide={ this.onHide }
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Settings for <b>{this.props.activeBevy.name}</b>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="new-bevy-picture">
            <Uploader
              onUploadComplete={ this.onUploadComplete }
              className="bevy-image-dropzone"
              style={ bevyImageStyle }
              dropzoneOptions={ dropzoneOptions }
              tooltip='Change Bevy Picture'
            />
          </div>
          <div className='text-fields'>
            <div className='name'>
              <TextField
                type='text'
                ref={(ref) => { this.NameInput = ref; }}
                placeholder='Group Name'
                value={ this.state.name }
                onChange={() => {
                  this.setState({
                    name: this.NameInput.getValue(),
                    slug: getSlug(this.NameInput.getValue())
                  });
                  this.onSlugChange();
                }}
              />
            </div>
            <div className='slug'>
              <TextField
                type='text'
                ref={(ref) => { this.SlugInput = ref; }}
                floatingLabelText='Bevy URL'
                errorText={ (this.state.slugVerified) ? '' : 'URL taken' }
                value={ constants.siteurl + '/b/' + this.state.slug }
                onChange={() => {
                  this.setState({
                    slug: this.SlugInput.getValue().slice((constants.siteurl.length + 3))
                  });
                  this.onSlugChange();
                }}
                onBlur={() => {
                  this.setState({
                    slug: getSlug(this.SlugInput.getValue().slice((constants.siteurl.length + 3)))
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
          <div className='bevy-setting expire-setting'>
            Privacy
            <OverlayTrigger placement='right' overlay={
              <Popover id='settingspopover' title='Bevy Privacy'>
                <p className='warning'>
                  Public bevies can be viewed and joined by anybody.
                  <br /><br />
                  Private bevies are listed publicly but require an invite or
                  permission to join and view content.
                </p>
              </Popover>
            }>
              <span className='glyphicon glyphicon-question-sign' />
            </OverlayTrigger>
            <DropDownMenu
              ref='privacy'
              menuItems={ privacyMenuItems }
              onChange={ this.onPrivacyChange }
              selectedIndex={ privacyIndex }
            />
          </div>
          <div className='bevy-setting'>
            <RaisedButton
              label='Delete Bevy'
              backgroundColor='#d9534f'
              labelColor='#fff'
              style={{
                backgroundColor: '#d9534f',
                width: '100%'
              }}
              labelStyle={{
                color: '#fff',
                fontWeight: 'bold'
              }}
              onClick={ this.destroyBevy }
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <FlatButton
            onClick={ this.props.onHide }
            label='Cancel'
          />
          <div style={{ flexGrow: 1 }} />
          <RaisedButton
            onClick={ this.save }
            label='Save' />
        </Modal.Footer>
      </Modal>
    );
  }
});

module.exports = BevySettingsModal;
