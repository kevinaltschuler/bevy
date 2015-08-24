/**
 * index.js
 *
 * true entry point of the app
 * loaded by index.html
 *
 * set up all dependents and bootstrap React
 *
 * @author albert
 */

'use strict';

var constants = require('./constants');

if(constants.env == 'development')
  require("./../less/app.less"); // only hot load css in development mode

var _ = require('underscore');
var $ = require('jquery');

// load globals
var Backbone = require('backbone');

var React = require('react');
var router = require('./router');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
// chrome and maybe other browsers like to remember the scroll position on a page reload
// when theres a specified post in the url we need to override this by delaying this action a bit
// very jenk. will change later.
document.onreadystatechange = function() {
  if(document.readyState == 'complete') {
    setTimeout(function() {
      if(router.post_id) {
        var post = document.getElementById('post:' + router.post_id);
        if(post) {
          post.scrollIntoView();
          if($(document).scrollTop() != ($(document).height() - $(window).height()))
            $(document).scrollTop($(document).scrollTop() - 68);
        }
      }
    }, 50);
  }
};


// load components
var MainSection = require('./app/components/MainSection.jsx');

var LoginPage = require('./auth/components/LoginPage.jsx');
var RegisterPage = require('./auth/components/RegisterPage.jsx');
var ForgotPage = require('./auth/components/ForgotPage.jsx');
var ResetPage = require('./auth/components/ResetPage.jsx');

var injectTapEventPlugin = require("react-tap-event-plugin");
// App bootstrap
var App = React.createClass({

  getChildContext() { 
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillMount() {
    ThemeManager.setComponentThemes({
        textField: {
          focusColor: 'rgba(0,0,0,.40)'
        },
        datePicker: {
          color: 'rgba(0,0,0,.5)',
          textColor: 'white',
          calendarTextColor: 'rgba(0,0,0,.8)',
          selectColor: 'rgba(0,0,0,.7)',
          selectTextColor: 'white',
        },
        timePicker: {
          color: 'white',
          textColor: '#757575',
          accentColor: '#4C4C4C',
          clockColor: 'black',
          selectColor: '#707070',
          selectTextColor: 'white',
        },
        flatButton: {
          color: 'white',
          textColor: 'rgba(0,0,0,.8)',
          primaryTextColor: 'rgba(0,0,0,.8)',
          secondaryTextColor: 'rgba(0,0,0,.8)',
        },
      });
  },

  render() {
    injectTapEventPlugin();
    return (
      <div className='app-wrapper'>
        <InterfaceComponent />
      </div>
    );
  }
});

// Important!
App.childContextTypes = {
  muiTheme: React.PropTypes.object
};

var InterfaceComponent = React.createClass({
  componentWillMount() {
    this.callback = (function() {
      this.forceUpdate();
    }).bind(this);

    router.on('route', this.callback);
  },
  componentWillUnmount() {
    router.off('route', this.callback);
  },
  render() {
    switch(router.current) {
      case 'home':
        return <MainSection />
        break;
      case 'login':
        return <LoginPage />
        break;
      case 'register':
        return <RegisterPage />
        break;
      case 'forgot':
        return <ForgotPage />
        break;
      case 'reset':
        return <ResetPage />
        break;
      default:
        return <MainSection />
        break;
    }
  }
});

React.render(<App />, document.body);
