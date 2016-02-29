/**
 * BoardSettingsModal.jsx
 *
 * @author kevin
 * @author albert
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
  TextField,
  MenuItem
} = require('material-ui');

var _ = require('underscore');
var BoardActions = require('./../BoardActions');
var Uploader = require('./../../shared/components/Uploader.jsx');
var constants = require('./../../constants');

var BoardSettingsModal = React.createClass({
  propTypes: {
    board: React.PropTypes.object,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getInitialState() {
    return {
      posts_expire_in: this.props.board.settings.posts_expire_in,
      privacy: this.props.board.settings.privacy,
      name: this.props.board.name,
      description: this.props.board.description,
      image: this.props.board.image
    };
  },

  onDropDownChange(ev, selectedIndex, menuItem) {
    ev.preventDefault();
    this.setState({
      posts_expire_in: menuItem.payload
    });
  },

  onPrivacyChange(ev, selectedIndex, menuItem) {
    var privacy = (selectedIndex == 1) ? 'Private' : 'Public';
    ev.preventDefault();
    this.setState({
      privacy: privacy,
    });
  },

  onUploadComplete(file) {
    this.setState({
      image: file,
    });
  },

  save(ev) {
    BoardActions.update(
      this.props.board._id,
      this.state.name,
      this.state.description,
      this.state.image,
      {
      }
    );
    this.props.onHide();
  },

  destroyBoard(ev) {
    ev.preventDefault();
    if(!confirm('Are you sure? Deleting a board will also remove all '
    + 'content posted to that bevy.'))
      return;

    BoardActions.destroy(this.props.board);
    this.props.onHide();
  },

  render() {
    var board = this.props.board;
    var settings = board.settings;

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
          if(this.files[1]!=null) {
            this.removeFile(this.files[0]);
          }
        });
      }
    };
    var boardImageURL = (_.isEmpty(this.state.image))
      ? constants.siteurl + '/img/default_group_img.png'
      : (this.state.image.foreign)
        ? this.state.image.filename
        : constants.apiurl + '/files/' + this.state.image.filename;
    var boardImageStyle = {
      backgroundImage: 'url(' + boardImageURL + ')',
      backgroundSize: '100% auto'
    };

    return (
      <Modal className="bevy-settings-modal" show={ this.props.show } onHide={ this.props.onHide } >
        <Modal.Header closeButton>
          <Modal.Title>
            Settings for <b>{this.props.board.name}</b>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <div className='text-fields'>
            <div className='name'>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                Name
                <TextField
                  type='text'
                  ref={(ref) => { this.NameInput = ref; }}
                  placeholder='Group Name'
                  value={ this.state.name }
                  underlineFocusStyle={{borderColor: '#666'}}
                  onChange={() => {
                    this.setState({
                      name: this.NameInput.getValue(),
                    });
                  }}
                 />
              </div>

              <br/>

              <div style={{display: 'flex', flexDirection: 'column'}}>
                Description
                <TextField
                  type='text'
                  ref={(ref) => { this.DescriptionInput = ref; }}
                  placeholder='Board Description'
                  value={ this.state.description }
                  underlineFocusStyle={{borderColor: '#666'}}
                  onChange={() => {
                    this.setState({
                      description: this.DescriptionInput.getValue(),
                    });
                  }}
                 />
              </div>

              <br/>
            </div>
          </div>

          <div className="new-bevy-picture">
            <Uploader
              onUploadComplete={ this.onUploadComplete }
              className="bevy-image-dropzone"
              style={ boardImageStyle }
              dropzoneOptions={ dropzoneOptions }
              tooltip='Change Board Picture'
            />
          </div>

          <div className='bevy-setting expire-setting'>
            Privacy
            <OverlayTrigger placement='right' overlay={
              <Popover id='board-settings-popover' title='Bevy Privacy'>
                <p className='warning'>
                  Public bevies can be viewed and joined by anybody. <br /><br />
                  Private bevies are listed publicly but require an invite or permission to join and view content.
                </p>
              </Popover>
            }>
              <span className='glyphicon glyphicon-question-sign' />
            </OverlayTrigger>
            <DropDownMenu
              ref='privacy'
              onChange={ this.onPrivacyChange }
              value={ privacyIndex }
            >
              <MenuItem value={0} primaryText='Public'/>
              <MenuItem value={1} primaryText='Private'/>
            </DropDownMenu>
          </div>
          <div className='bevy-setting'>
            <RaisedButton
              label='Delete Board'
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
              onClick={ this.destroyBoard }
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

module.exports = BoardSettingsModal;
