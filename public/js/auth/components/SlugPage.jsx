/**
 * SlugPanel.jsx
 *
 * panel for entering
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  TextField,
  RaisedButton,
  FontIcon,
  CircularProgress,
  FlatButton
} = require('material-ui');
var {
  Panel,
  Input
} = require('react-bootstrap');
var Ink = require('react-ink');

var _ = require('underscore');
var constants = require('./../../constants');

var SlugPage = React.createClass({
  propTypes: {
    onSlugSubmit: React.PropTypes.func
  },

  getInitialState() {
    return {
      slug: '',
      error: '',
      verifying: false
    };
  },

  onSlugChange() {
    var slug = this.refs.slug.getValue();
    this.setState({ slug: slug });

    // if slug is cleared, clear the error
    if(_.isEmpty(slug)) {
      this.setState({ error: '' });
    }
  },

  submit() {
    if(this.state.verifying) return;
    if(_.isEmpty(this.state.slug)) {
      return this.setState({ error: 'Please enter your group\'s Bevy domain' });
    } else {
      this.setState({ error: '' });
    }
    //this.props.onSlugSubmit(this.state.slug);
    this.setState({
      verifying: true
    });
    fetch(constants.apiurl + '/bevies/' + this.state.slug + '/verify', {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      setTimeout(() => {
        if(!_.isObject(res)) {
          this.setState({
            error: res,
            verifying: false
          });
          this.refs.slug.focus();
          return;
        }
        if(res.found) {
          // go to the new bevy's subdomain
          window.location.href = 'http://' + this.state.slug + '.' + constants.domain;
        } else {
          this.setState({
            error: 'Group domain not found',
            verifying: false
          });
          this.refs.slug.focus();
        }
      }, 250);
    })
    .catch(err => {
      this.setState({
        verifying: false,
        error: err.toString()
      });
      this.refs.slug.focus();
    });
  },

  renderLoadingOrArrow() {
    if(this.state.verifying) {
      return (
        <div className='progress-container'>
          <CircularProgress
            mode='indeterminate'
            color='#FFF'
            size={ 0.4 }
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
      <div className='login-container'>
        <div className='login-header'>
          <a title='Home' href={ constants.siteurl }>
            <img src='/img/logo_200_solid.png' height="60" width="60"/>
          </a>
          <h1>Bevy</h1>
        </div>
        <div className='login-title'>
          <h2>Sign in to continue.</h2>
        </div>
        <Panel className='slug-panel'>
          <h2 className='prompt'>
            Enter your group's <span className='bold'>Bevy domain</span>
          </h2>
          <div className='inputs'>
            <TextField
              ref='slug'
              type='text'
              hintText='Group Domain'
              fullWidth={ true }
              onChange={ this.onSlugChange }
              value={ this.state.slug }
              errorText={ this.state.error }
              hintStyle={{
                right: 0
              }}
            />
            <span className='domain'>
              { '.' + constants.domain }
            </span>
          </div>
          <button
            className='submit-btn'
            onClick={ this.submit }
            style={{
              cursor: (this.state.verifying)
                ? 'default'
                : 'pointer',
              backgroundColor: (this.state.verifying)
                ? '#888'
                : '#2CB673'
            }}
          >
            <Ink />
            <span className='submit-button-text'>
              Continue
            </span>
            { this.renderLoadingOrArrow() }
          </button>
        </Panel>
        <div className='back-link'>
          <span className='reg-text'>
            Don't remember your group's domain?&nbsp;
          </span>
          <a
            title='Find your group'
            href="/forgot/team"
          >
            Find your group
          </a>
        </div>
        <div className='back-link'>
          <span className='reg-text'>
            Looking to create a new Bevy for your group?&nbsp;
          </span>
          <a
            title='Create a Bevy for your group'
            href='/create'
          >
            Create a Bevy for your group
          </a>
        </div>
        <br/>
      </div>
    );
  }
});

module.exports = SlugPage;
