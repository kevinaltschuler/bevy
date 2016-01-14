/**
 * HomeView.jsx
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');
var {
  Button
} = require('react-bootstrap');
var {
  RaisedButton
} = require('material-ui');

var CreateNewBevyModal = require('./../../bevy/components/CreateNewBevyModal.jsx');
var Feature = require('./Feature.jsx');

var _ = require('underscore');
var router = require('./../../router');

var $ = require('jquery');
var TYPED = require('./typed.js').TYPED;


var HomeView = React.createClass({
  getInitialState() {
    return {
      showNewBevyModal: false,
      selected: 0
    };
  },

  componentDidMount() {
    TYPED($);
    $(function(){
        $(".typedSpan").typed({
            strings: ["Fraternity.", "Sorority.", "Non Profit.", "Club.", "Business.", "Community."],
            typeSpeed: 50,
            startDelay: 1000,
            backDelay: 800,
            backSpeed: 5
        });
    })
  },

  render() {

    var boardScreenStyle = (this.state.selected == 0)
    ? {
      backgroundImage: "url('./../../../img/boardscreen.png')",
      marginLeft: "-580px",
      marginTop: "50px",
      backgroundSize: "auto 100%"
    }
    : {
      display: 'none',
      backgroundImage: "url('./../../../img/boardscreen.png')",
    }

    var chatScreenStyle = (this.state.selected == 1)
    ? {
      backgroundImage: "url('./../../../img/chatscreen.png')",
      marginLeft: "-300px",
      marginTop: "50px",
      backgroundSize: "auto 100%",
      backgroundPosition: '100% 50%'
    }
    : {
      display: 'none',
      backgroundImage: "url('./../../../img/chatscreen.png')",
    }

    var feedScreenStyle = (this.state.selected == 2)
    ? {
      backgroundImage: "url('./../../../img/postscreen.png')",
      marginLeft: "-450px",
      marginTop: "30px",
      backgroundSize: "auto 100%"
    }
    : {
      display: 'none',
      backgroundImage: "url('./../../../img/postscreen.png')",
    }

    return (
      <div className='landing-page'>
        <div className='landing-div div1'>
          <img style={{width: 100, height: 100}} src='./../../../img/logo_300_white.png'/>
          <div className='title-text'>
            Bevy
          </div>
          <div className='sub-title-text'>
            The Social Network For Your &nbsp; &nbsp;&nbsp;<span className="typedSpan"></span>
          </div>
          <div className='actions'>
            <RaisedButton
              linkButton={ true }
              label='Register' href='/bevies'
              onClick={(ev) => {
                ev.preventDefault();
                router.navigate('/register', { trigger: true });
              }}
            />
            <RaisedButton
              linkButton={ true }
              label='Login' href='/bevies'
              style={{
                minWidth: 50
              }}
              onClick={(ev) => {
                ev.preventDefault();
                router.navigate('/login', { trigger: true });
              }}
            />
          </div>
        </div>
        <div className='landing-div div2'>
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
        </div>
        <div className='landing-div div3'>
          <div className='features-title'>
            This is How
          </div>
          <div className='feature-section'>
            <div className='features'>
              <Feature 
                title='Boards' 
                icon={<i className='material-icons'>view_carousel</i>}
                onClick={() => {
                  this.setState({
                    selected: 0
                  })
                }}
                index={0}
                selected={this.state.selected}
                description='Organize your team into boards. Make a board for committees, social groups, announcements, or event feeds.'
              />
              <Feature
                title='Feed'
                icon={<i className='material-icons'>view_day</i>}
                onClick={() => {
                  this.setState({
                    selected: 2
                  })
                }}
                index={2}
                selected={this.state.selected}
                description="All recent activity is easily viewed straight from your community's frontpage"
              />
              <Feature
                title='Chat'
                icon={<i className='material-icons'>chat_bubble</i>}
                onClick={() => {
                  this.setState({
                    selected: 1
                  })
                }}
                index={1}
                selected={this.state.selected}
                description="Each board has a group chat for all it's members, we also support group and private chat"
              />
            </div>
            <img style={{width: 600, height: 352}} className='simplemock' src='./../../../img/simplemock.png'>
              <div style={boardScreenStyle} className='screenshot'/>
              <div style={chatScreenStyle} className='screenshot'/>
              <div style={feedScreenStyle} className='screenshot'/>
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
