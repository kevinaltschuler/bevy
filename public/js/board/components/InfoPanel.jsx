/**
 * InfoPanel.jsx
 * formerly WUSGUCCI.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var {
  FlatButton,
  RaisedButton
} = require('material-ui');

var BoardSettingsModal = require('./BoardSettingsModal.jsx');
var InfoPanelHeader = require('./InfoPanelHeader.jsx');
var AdminModal = require('./../../bevy/components/AdminModal.jsx');

var _ = require('underscore');
var constants = require('./../../constants');

var InfoPanel = React.createClass({

  propTypes: {
    board: React.PropTypes.object
  },

  getInitialState() {
    //var joined = (_.findWhere(this.props.myBevies, { _id: this.props.activeBevy._id }) != undefined);
    return {
      //joined: joined,
      showSettingsModal: false,
      showAdminModal: false
    };
  },

  componentWillReceiveProps(nextProps) {
    /*var joined = (_.findWhere(nextProps.myBevies, { _id: nextProps.activeBevy._id }) != undefined);
    this.setState({
      joined: joined
    });*/
  },

  /*onRequestJoin(ev) {
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
  },*/

  _renderPublicPrivate() {
    if(this.props.board.settings.privacy == 0) {
      // public
      return <span className='info-item'><i className="material-icons">public</i>&nbsp;Public</span>;
    } else {
      // private
      return <span className='info-item'><i className="material-icons">lock</i>&nbsp;Private</span>;
    }
  },

  _renderBottomActions() {
    if(_.isEmpty(window.bootstrap.user)) return <div />;
    
    var joinButton = (this.state.joined)
    ? <FlatButton label='leave' onClick={ this.onRequestLeave } />
    : <RaisedButton label='join' onClick={ this.onRequestJoin } /> 

    console.log(this.props.board.admins, window.bootstrap.user._id);

    if(_.findWhere(this.props.board.admins, window.bootstrap.user._id ) != undefined) {
      return (
        <div className='sidebar-bottom'>
          <FlatButton 
            label='Settings' 
            onClick={() => { this.setState({ showSettingsModal: true }); }}
          />
          <BoardSettingsModal 
            board={ this.props.board } 
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
    var board = this.props.board;

    if(_.isEmpty(board))
      return <div/>;

    return (
      <div className="bevy-panel panel">
        <InfoPanelHeader {...this.props}/>
        <div className='bevy-info'>
          <div className='info-item'>
            <i className="material-icons">people</i>
            { board.subCount }&nbsp;{ (board.subCount == 1) ? 'subscriber' : 'subscribers' }
          </div>
          <div 
            href='#' 
            onClick={(ev) => {
              ev.preventDefault();
              if(board.admins.length <= 0) return;
              this.setState({
                showAdminModal: true
              });
            }}
            className='info-item'
          >
            <i className="material-icons">person</i>
            { board.admins.length }&nbsp;{ (board.admins.length == 1) ? 'admin' : 'admins' }
          </div>
          { this._renderPublicPrivate() }
          <AdminModal
            show={ this.state.showAdminModal }
            onHide={() => this.setState({ showAdminModal: false })}
            activeBevy={ board }
          />
        </div>
        { this._renderBottomActions() }
      </div>
    );
  }
});

module.exports = InfoPanel;
