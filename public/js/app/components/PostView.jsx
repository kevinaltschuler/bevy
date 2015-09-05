/**
 * PostView.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var router = require('./../../router');

var {
  RaisedButton,
  Snackbar
} = require('material-ui');

var PostSort = require('./../../post/components/PostSort.jsx');
var PostContainer = require('./../../post/components/PostContainer.jsx');
var NewPostPanel = require('./../../post/components/NewPostPanel.jsx');
var LeftSidebar = require('./LeftSidebar.jsx');
var RightSidebar = require('./RightSidebar.jsx');

var BevyActions = require('./../../bevy/BevyActions');

var PostView = React.createClass({

  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    allThreads: React.PropTypes.array,
    allPosts: React.PropTypes.array,
    activeTags: React.PropTypes.array,
    allBevies: React.PropTypes.array
  },

  onRequestJoin(ev) {
    ev.preventDefault();
    BevyActions.requestJoin(this.props.activeBevy, window.bootstrap.user);
    this.refs.snackbar.show();
  },

  render() {
    var disabled = false;
    var hidden = false;
    var activeBevy = this.props.activeBevy;

    if(_.isEmpty(window.bootstrap.user)) {
      disabled = true;
    }
    if(!_.isEmpty(activeBevy)) {
      if(activeBevy.settings.privacy == 1) {
        if(_.isEmpty(window.bootstrap.user)) {
          hidden = true;
          disabled = true;
        }
        else if(!_.find(window.bootstrap.user.bevies, 
          function(bevyId) { 
          return bevyId == this.props.activeBevy._id 
        }.bind(this))) {
          hidden = true;
          disabled = true;
        }
      }
    }
      

    var activeBevy = this.props.activeBevy;

    if(this.props.activeBevy.name == null) {
      return <div/>
    }

    if(hidden) {
      return (
      <div className='main-section private-container'>
        <div className='private panel'>
          <div className='private-img'/>
          you must be approved by an <br/>admin to view this community<br/><br/>
          <RaisedButton label='request join' onClick={ this.onRequestJoin }/>
          <Snackbar
            message="Invitation Requested"
            autoHideDuration={5000}
            ref='snackbar'
            style={{fontSize: '14px', fontWeight: '300'}}
          />
        </div>
      </div>
      );
    }

    var body = (
      <div>
        <NewPostPanel
          activeBevy={ this.props.activeBevy }
          myBevies={ this.props.myBevies }
          disabled={disabled}
        />
        <PostSort 
          activeBevy={ this.props.activeBevy}
          sortType={ this.props.sortType }
          disabled={ disabled }
        />
        <PostContainer
          allPosts={ this.props.allPosts }
          activeBevy={ this.props.activeBevy }
          sortType={ this.props.sortType }
          activeTags={ this.props.activeTags }
        />
      </div>
    );

    return (
      <div className='main-section'>
        <LeftSidebar
          myBevies={ this.props.myBevies }
          activeBevy={ this.props.activeBevy }
          allThreads={ this.props.allThreads }
          activeTags={ this.props.activeTags }
          allBevies={ this.props.allBevies }
        />
        <div className='post-view-body'>
          { body }
        </div>
        <RightSidebar
          activeBevy={ this.props.activeBevy }
          disabled={ _.isEmpty(window.bootstrap.user) }
          myBevies={ this.props.myBevies }
        />
      </div>
    );
    }
});

module.exports = PostView;
