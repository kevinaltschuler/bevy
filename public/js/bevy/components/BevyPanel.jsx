/**
 * BevyPanel.jsx
 * formerly RightSidebar.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var {
  FlatButton,
  RaisedButton
} = require('material-ui');

var BevySettingsModal = require('./BevySettingsModal.jsx');
var BevyPanelHeader = require('./BevyPanelHeader.jsx');
var AdminModal = require('./AdminModal.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var BevyActions = require('./../BevyActions');

var BevyPanel = React.createClass({

  propTypes: {
    activeBevy: React.PropTypes.object,
    myBevies: React.PropTypes.array.isRequired
  },

  getInitialState() {
    var joined = (_.findWhere(this.props.myBevies, { _id: this.props.activeBevy._id }) != undefined);
    return {
      joined: joined,
      showSettingsModal: false,
      showAdminModal: false
    };
  },

  componentWillReceiveProps(nextProps) {
    var joined = (_.findWhere(nextProps.myBevies, { _id: nextProps.activeBevy._id }) != undefined);
    this.setState({
      joined: joined
    });
  },

  onRequestJoin(ev) {
    ev.preventDefault();
    BevyActions.join(this.props.activeBevy._id, window.bootstrap.user._id, window.bootstrap.user.email);
    var bevy = this.props.bevy;
    this.setState({
      joined: true
    });
  },

  onRequestLeave(ev) {
    ev.preventDefault();
    BevyActions.leave(this.props.activeBevy._id);
    var bevy = this.props.bevy;
    this.setState({
      joined: false
    });
  },

  _renderPublicPrivate() {
    if(this.props.activeBevy.settings.privacy == 0) {
      // public
      return <span className='bevy-privacy'><span className='glyphicon glyphicon-globe' />&nbsp;Public</span>;
    } else {
      // private
      return <span className='bevy-privacy'><span className='glyphicon glyphicon-lock' />&nbsp;Private</span>;
    }
  },

  _renderBottomActions() {
    if(_.isEmpty(window.bootstrap.user)) return <div />;
    
    var joinButton = (this.state.joined)
    ? <FlatButton label='leave' onClick={ this.onRequestLeave } />
    : <RaisedButton label='join' onClick={ this.onRequestJoin } /> 

    if(_.findWhere(this.props.activeBevy.admins, { _id: window.bootstrap.user._id }) != undefined) {
      return (
        <div className='sidebar-bottom'>
          <FlatButton 
            label='Settings' 
            onClick={() => { this.setState({ showSettingsModal: true }); }}
          />
          <BevySettingsModal 
            activeBevy={ this.props.activeBevy } 
            show={ this.state.showSettingsModal }
            onHide={() => { this.setState({ showSettingsModal: false }); }}
          />
          { joinButton }
        </div>
      );
    } else {
      return (
        <div className='sidebar-bottom'>
          <div style={{ flex: 1 }} />
          { joinButton }
        </div>
      );
    }
  },

  render() {
    return (
      <div className="bevy-panel panel">
        <BevyPanelHeader {...this.props}/>
        <div className='bevy-info'>
          <span className='member-count'>{ this.props.activeBevy.subCount } { (this.props.activeBevy.subCount == 1) ? 'subscriber' : 'subscribers' }</span>
          <a href='#' onClick={(ev) => {
            ev.preventDefault();
            if(this.props.activeBevy.admins.length <= 0) return;
            this.setState({
              showAdminModal: true
            });
          }}
          className='admin-count'>{ this.props.activeBevy.admins.length }&nbsp;{ (this.props.activeBevy.admins.length == 1) ? 'admin' : 'admins' }</a>
          { this._renderPublicPrivate() }
          <AdminModal
            show={ this.state.showAdminModal }
            onHide={() => this.setState({ showAdminModal: false })}
            activeBevy={ this.props.activeBevy }
          />
        </div>
        { this._renderBottomActions() }
      </div>
    );
  }
});

module.exports = BevyPanel;
