/**
 * HomeView.jsx
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');
var {
  Button,
  Input
} = require('react-bootstrap');
var {
  RaisedButton,
  TextField
} = require('material-ui');

var Feature = require('./Feature.jsx');

var _ = require('underscore');
var router = require('./../../router');
var constants = require('./../../constants');

var $ = require('jquery');
var TYPED = require('./typed.js').TYPED;

var HomeView = React.createClass({
  getInitialState() {
    return {
      showNewBevyModal: false,
      selected: 0,
    };
  },

  componentDidMount() {
    TYPED($);
    $(function(){
      $(".typedSpan").typed({
          strings: [
            "Fraternity.",
            "Sorority.",
            "Non-Profit.",
            "Club.",
            "Sports Team.",
            "Business.",
            "Classroom.",
            "Community."
          ],
          typeSpeed: 50,
          startDelay: 1000,
          backDelay: 800,
          backSpeed: 5,
          loop: true
      });
    })
  },

  // if the user is logged in, present a nifty and handy link to
  // go straight to their bevy
  renderBevyLink() {
    // dont render anything if they're not logged in
    if(_.isEmpty(window.bootstrap.user)) return <div />;
    return (
      <div className='bevy-link-container'>
        <span className='text'>
          You're already logged in!
        </span>
        <a
          className='bevy-link'
          title={ 'Go to ' + window.bootstrap.user.bevy.name }
          href={ 'http://' + window.bootstrap.user.bevy.slug + '.' + constants.domain }
        >
          <span>{ 'Go to ' + window.bootstrap.user.bevy.name }</span>
          <i className='material-icons'>arrow_forward</i>
        </a>
      </div>
    );
  },

  renderLoginButton() {
    if(!_.isEmpty(window.bootstrap.user)) return <div />;
    return (
      <RaisedButton
        label='Sign In'
        linkButton={ true }
        title='Sign in to Bevy'
        href='/signin'
        style={{
          marginLeft: 10
        }}
      />
    );
  },

  render() {
    return (
      <div className='landing-page'>
        <div className='landing-div div1'>
          <img style={{width: 100, height: 100}} src='./../../../img/logo_300_white.png'/>
          <div className='title-text'>
            Bevy
          </div>
          <div className='sub-title-text'>
            The Social Network For Your &nbsp; &nbsp;&nbsp;
            <span className="typedSpan"></span>
          </div>
          { this.renderBevyLink() }
          <div className='actions'>
            <RaisedButton
              label='Start a Community'
              linkButton={ true }
              title='Start a Community'
              href='/create'
            />
            { this.renderLoginButton() }
          </div>
        </div>
        {/*<div className='landing-div div2'>
          <div className='sub-title-text'>
            Unify Communication
          </div>
          <div className='items'>
            <div className='item'>
              <i className='material-icons'>chat_bubble</i>
              <div className='item-title'>
                Chat
              </div>
            </div>
            <div className='item'>
              <i className='material-icons'>view_agenda</i>
              <div className='item-title'>
                Groups
              </div>
            </div>
            <div className='item'>
              <i className='material-icons'>email</i>
              <div className='item-title'>
                Email
              </div>
            </div>
          </div>
          <div className='bracket'>}</div>
          <img style={{width: 100, height: 100}} src='./../../../img/logo_200.png'/>
          <div style={{fontWeight: 'bold', fontSize: 40, marginTop: 10}}>
            Bevy
          </div>
        </div>*/}
        <div className='landing-div div3'>
          <div className='features-title'>
            Unify Communication
          </div>
          <div className='feature-section'>
            <div className='features'>
              <Feature
                title='Boards'
                icon={<i className='material-icons'>view_carousel</i>}
                onClick={() => this.setState({ selected: 0 })}
                index={ 0 }
                selected={ this.state.selected }
                description={'Organize your team into boards. Make a board \
                  for committees, social groups, announcements, or event feeds.'}
              />
              <Feature
                title='Feed'
                icon={<i className='material-icons'>view_day</i>}
                onClick={() => this.setState({ selected: 2 })}
                index={ 2 }
                selected={ this.state.selected }
                description={"All recent activity is easily viewed straight \
                  from your community's frontpage"}
              />
              <Feature
                title='Chat'
                icon={<i className='material-icons'>chat_bubble</i>}
                onClick={() => this.setState({ selected: 1 })}
                index={ 1 }
                selected={ this.state.selected }
                description={"Each board has a group chat for all it's members, \
                  we also support group and private chat"}
              />
            </div>
            <img
              className='simplemock'
              style={{width: 600, height: 352}}
              src='./../../../img/simplemock.png'
            >
              <div
                className='screenshot screenshot1'
                style={(this.state.selected == 0)
                  ? { backgroundImage: "url('./../../../img/boardscreen.png')" }
                  : {
                    opacity: 0,
                    backgroundImage: "url('./../../../img/boardscreen.png')" }
                }
              />
              <div
                className='screenshot screenshot2'
                style={(this.state.selected == 1)
                  ? { backgroundImage: "url('./../../../img/chatscreen.png')" }
                  : {
                    opacity: 0,
                    backgroundImage: "url('./../../../img/chatscreen.png')"
                  }
                }
              />
              <div
                className='screenshot screenshot3'
                style={(this.state.selected == 2)
                  ? { backgroundImage: "url('./../../../img/postscreen.png')" }
                  : {
                    opacity: 0,
                    backgroundImage: "url('./../../../img/postscreen.png')"
                  }
                }
              />

            </img>
          </div>
        </div>
        <div className='landing-div div4'/>
        <div className="footer-home">
          <div className='footer-left'>
            Bevy © 2015
          </div>
          <div className='footer-right'>
            <Button
              title='Home'
              className="bevy-logo-btn"
              href='/'
            >
              <div className='bevy-logo-img' style={{backgroundImage: 'url(/img/logo_100_reversed.png)'}}/>
            </Button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = HomeView;
