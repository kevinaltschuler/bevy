/**
 * PostView.jsx
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  CircularProgress
} = require('material-ui');
var PostContainer = require('./../../post/components/PostContainer.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var PostStore = require('./../../post/PostStore');
var PostActions = require('./../../post/PostActions');
var POST = constants.POST;

var PostView = React.createClass({
  propTypes: {
    activeBoard: React.PropTypes.object
  },

  getInitialState() {
    return {

    };
  },

  goBack(ev) {
    if(ev) ev.preventDefault();
    router.navigate('/boards/' + this.props.activeBoard._id, { trigger: true });
  },

  render() {
    return (
      <div className='post-view'>
        <div className='top-bar'>
          <a
            className='back-link'
            title={ 'Back to ' + this.props.activeBoard.name }
            href={ '/boards/' + this.props.activeBoard._id }
            onClick={ this.goBack }
          >
            <i className='material-icons'>arrow_back</i>
            <span className='back-link-text'>
              Back to { this.props.activeBoard.name }
            </span>
          </a>
        </div>
        <PostContainer
          activeBevy={ this.props.activeBevy }
          activeBoard={ this.props.activeBoard }
          searchOpen={ false }
          searchQuery={ '' }
        />
      </div>
    );
  }
});

module.exports = PostView;
