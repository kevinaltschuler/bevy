/**
 * InviteUsersModal.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var {
  Modal
} = require('react-bootstrap');
var {
  FlatButton,
  RaisedButton,
  IconButton,
  TextField,
  Styles,
  CircularProgress
} = require('material-ui');
var Ink = require('react-ink');

var ThemeManager = new Styles.ThemeManager();

var _ = require('underscore');
var BevyActions = require('./../BevyActions');
var BevyStore = require('./../BevyStore');
var UserActions = require('./../../user/UserActions');
var UserStore = require('./../../user/UserStore');
var constants = require('./../../constants');
var timeAgo = require('./../../shared/helpers/timeAgo');

var USER = constants.USER;
var BEVY = constants.BEVY;

var InviteUsersModal = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getChildContext() {
    return { muiTheme: ThemeManager.getCurrentTheme() };
  },

  getInitialState() {
    return {
      invites: [],
      inviteFieldRefs: [ 'invite:0' ],
      inviteFieldErrors: [ '' ],
      loading: false
    };
  },

  componentWillReceiveProps(nextProps) {
    // once the modal is shown,
    // autofocus the first invite TextField
    if(nextProps.show) {
      setTimeout(() => {
        this.refs[this.state.inviteFieldRefs[0]].focus();
      }, 500);
    }
  },

  componentDidMount() {
    // once the component is mounted, fetch the invites for this bevy
    // TODO: if there's more than five, only show five and have a collapsed button
    // "show more" here
    fetch(constants.apiurl + '/bevies/' + this.props.activeBevy._id + '/invites', {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        invites: res
      });
    })
    .catch(err => {
    });
  },

  componentWillMount() {
    ThemeManager.setComponentThemes({
      textField: {
        textColor: '#666',
        focusColor: '#666'
      },
    });
  },

  componentWillUnmount() {
  },

  onHide() {
    // reset the state and clear any inputs the user might've made
    this.setState(this.getInitialState());
    // then hide the modal
    this.props.onHide();
  },

  submit() {
    // if we're in the process of making this request already, then abort
    if(this.state.loading) return;

    // check if they entered any emails at all
    // or if the emails they entered are invalid

    // first load a local version of the errors array
    var inviteFieldErrors = this.state.inviteFieldErrors;
    // and some helper vars
    var allFieldsAreEmpty = true;
    var inviteEmails = [];

    // loop thru all refs
    for(var key in this.state.inviteFieldRefs) {
      var inviteFieldRef = this.refs[this.state.inviteFieldRefs[key]];
      if(inviteFieldRef == undefined) continue;
      var inviteEmail = inviteFieldRef.getValue();
      // if theres something there, then flip the empty flag
      if(!_.isEmpty(inviteEmail)) allFieldsAreEmpty = false;
      // verify that what they entered is an email
      // dont do no fancy regex here. just check if there's an '@' somewhere in there
      if(inviteEmail.split('@').length < 2) {
        inviteFieldErrors[key] = 'Please enter a valid email address';
      } else {
        // everything is okay with this field. clear any errors that might've been there
        // and push it to an array of approved, non-empty emails to send to the server
        inviteFieldErrors[key] = '';
        inviteEmails.push(inviteEmail);
      }
    }

    // if they didn't enter in any emails, then don't bother sending the request
    // set the error field for the first textinput and get out of this function
    if(allFieldsAreEmpty) {
      inviteFieldErrors[0] = 'Please enter an email address';
      this.setState({ inviteFieldErrors: inviteFieldErrors });
      return;
    }

    // reset all the errors before the request is made
    // and flip the loading flag for responsive ui
    this.setState({
      inviteFieldErrors: inviteFieldErrors,
      loading: true
    });

    // send the request
    fetch(constants.apiurl + '/invites', {
      method: 'POST',
      body: JSON.stringify({
        emails: inviteEmails,
        bevy_id: this.props.activeBevy._id,
        inviter_name: window.bootstrap.user.username,
        inviter_email: window.bootstrap.user.email
      })
    })
    .then(res => res.json())
    .then(res => {
      // do an optimistic update of the listed invites above
      // and spoof the invite object that the PendingInviteItem needs
      var invites = this.state.invites;
      for(var key in inviteEmails) {
        invites.push({
          email: inviteEmails[key],
          bevy: this.props.activeBevy._id,
          created: (new Date).toString()
        });
      }
      // clear the first TextField
      this.refs['invite:0'].setValue('');
      // and then remove all of the other ones.
      // also flush the updated optimistic pending invite list to the state
      // and flip the loading flag back to let the user know its done
      this.setState({
        loading: false,
        invites: invites,
        inviteFieldRefs: [ 'invite:0' ],
        inviteFieldErrors: ['']
      });
    });
  },

  addInviteField() {
    // collect copies of the state vars for the invite fields
    var inviteFieldRefs = this.state.inviteFieldRefs;
    var inviteFieldErrors = this.state.inviteFieldErrors;

    // push an empty TextField and an empty error for it
    inviteFieldRefs.push('invite:' + inviteFieldRefs.length);
    inviteFieldErrors.push('');

    // flush this to the state
    this.setState({
      inviteFieldRefs: inviteFieldRefs,
      inviteFieldErrors: inviteFieldErrors
    });

    // wait till the new text field renders
    // before we auto focus it
    setTimeout(() => {
      this.refs[this.state.inviteFieldRefs[this.state.inviteFieldRefs.length - 1]].focus();
    }, 500);
  },

  renderPendingInvites() {
    var pendingInviteItems = [];
    for(var key in this.state.invites) {
      var invite = this.state.invites[key];
      pendingInviteItems.push(
        <PendingInviteItem
          key={ 'invite:' + key }
          invite={ invite }
        />
      );
    }
    return (
      <div className='pending-invites'>
        <span className='title'>
          Pending Invites
        </span>
        { pendingInviteItems }
      </div>
    );
  },

  renderInviteFields() {
    var fakeEmails = _.pluck(constants.fakeUsers, 'email');
    var inviteFields = [];
    for(var key in this.state.inviteFieldRefs) {
      var inviteField = this.state.inviteFieldRefs[key];
      inviteFields.push(
        <TextField
          key={ 'invite:' + key }
          ref={ inviteField }
          type='text'
          fullWidth={ true }
          style={{ flex: 1 }}
          errorText={ this.state.inviteFieldErrors[key] }
          hintText={ 'e.g., ' + fakeEmails[Math.floor(Math.random() * fakeEmails.length)] }
        />
      );
    }
    return (
      <div className='invite-fields'>
        { inviteFields }
      </div>
    )
  },

  renderLoadingOrArrow() {
    if(this.state.loading) {
      return (
        <div className='progress-container'>
          <CircularProgress
            mode='indeterminate'
            color='#888'
            size={ 0.25 }
            style={{
              top: -15,
              left: -10
            }}
          />
        </div>
      );
    } else {
      return (
        <i className='material-icons'>arrow_forward</i>
      );
    }
  },

  render() {
    return (
      <Modal
        className='bevy-invite-modal'
        show={ this.props.show }
        width='400px'
        onHide={ this.onHide }
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add users to&nbsp;
            <b>{ this.props.activeBevy.name }</b>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          { this.renderPendingInvites() }
          <span className='invite-others-title'>
            Invite Others
          </span>
          <span className='invite-others-hint'>
            Please enter a list of <span className='bold'>email addresses</span>
          </span>
          { this.renderInviteFields() }
          <div className='buttons'>
            <button
              className='invite-more-button'
              onClick={ this.addInviteField }
            >
              <Ink />
              <i className='material-icons'>add</i>
              <span className='invite-more-button-text'>
                Add more users
              </span>
            </button>
            <button
              className='submit-button'
              onClick={ this.submit }
              style={{
                cursor: (this.state.loading)
                  ? 'default'
                  : 'pointer',
                backgroundColor: (this.state.loading)
                  ? '#DDD'
                  : '#FFF'
              }}
            >
              <Ink />
              <span className='invite-more-button-text'>
                Invite users
              </span>
              { this.renderLoadingOrArrow() }
            </button>
          </div>
        </Modal.Body>

        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    );
  }
});

var PendingInviteItem = React.createClass({
  propTypes: {
    invite: React.PropTypes.object
  },

  render() {
    return (
      <div className='invite-item'>
        <div className='profile-image' />
        <div className='details'>
          <span className='email'>
            { this.props.invite.email }
          </span>
          <span className='time-ago'>
            Invited { timeAgo(Date.parse(this.props.invite.created)) }
          </span>
        </div>
      </div>
    );
  }
});

InviteUsersModal.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = InviteUsersModal;
