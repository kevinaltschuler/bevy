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

var injectTapEventPlugin = require("react-tap-event-plugin");

var _ = require('underscore');
var UserStore = require('./user/UserStore');

// load globals
var Backbone = require('backbone');
// backbone shim
Backbone.sync = function(method, model, options) {
  var headers = {
    'Accept': 'application/json'
  };
  var body = {};

  var url = model.url;
  if (!options.url) {
    url = _.result(model, 'url');
  } else {
    url = options.url;
  }

  if(options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
    headers['Content-Type'] = 'application/json';
    body = options.attrs || model.toJSON(options);
  }

  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };
  method = methodMap[method];

  var startTime = Date.now();
  //console.log('START ' + method + ' ' + url);

  var opts = {
    method: method,
    headers: headers,
    body: JSON.stringify(body)
  };
  if(method === 'GET' || method === 'HEAD')
    delete opts.body;

  return fetch(url, opts)
  .then(res => res.json())
  .then(res => {
    var endTime = Date.now();
    var deltaTime = endTime - startTime;
    //console.log('END', method, url);
    options.success(res, options);
  })
  .catch(error => {
    options.error(error.toString())
  });
};

var $fetch = window.fetch;
if($fetch == undefined) {
  require('./shared/polyfills/fetch.js');
  $fetch = self.fetch;
}
window.fetch = function(input, init) {
  var url = input;
  var options = init;
  if(options == undefined) options = {};
  if(_.isEmpty(options.headers)) {
    options.headers = {
      'Accept': 'application/json'
    };
    if(!_.isEmpty(options.body)) {
      options.headers['Content-Type'] = 'application/json';
    }
  }
  // if this is an api call
  if(url.includes(constants.apiurl)) {
    // if we have an authorization token
    if(!_.isEmpty(UserStore.getAccessToken())) {
      //console.log(localStorage.getItem('access_token'));
      options.headers['Authorization'] = 'Bearer ' + UserStore.getAccessToken();
      //console.log(UserStore.getAccessToken(), url);
    }
  } else {
    // if this is going back to the main site
    // include the cookie it sent to maintain the session
    options.credentials = 'include';
  }
  return $fetch(url, options);
};

var React = require('react');
var ReactDOM = require('react-dom');
var router = require('./router');

var injectTapEventPlugin = require("react-tap-event-plugin");
// App bootstrap
var App = React.createClass({
  render() {
    injectTapEventPlugin();
    return (
      <div className='app-wrapper'>
        <InterfaceComponent />
      </div>
    );
  }
});

// load components
var MainSection = require('./app/components/MainSection.jsx');
var LoginPage = require('./auth/components/LoginPage.jsx');
var ForgotPage = require('./auth/components/ForgotPage.jsx');
var ResetPage = require('./auth/components/ResetPage.jsx');
var CreateBevyPage = require('./bevy/components/CreateBevyPage.jsx');
var InvitePage = require('./invite/components/InvitePage.jsx');
var SlugPage = require('./auth/components/SlugPage.jsx');
var FourOhFour = require('./app/components/FourOhFour.jsx');
var ForgotGroupPage = require('./auth/components/ForgotGroupPage.jsx');

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
        return <MainSection />;
        break;
      case 'login':
        return <LoginPage />;
        break;
      case 'forgot':
        return <ForgotPage />;
        break;
      case 'forgotGroup':
        return <ForgotGroupPage />;
        break;
      case 'reset':
        return <ResetPage />;
        break;
      case 'newBevy':
        return <CreateBevyPage />;
        break;
      case 'invite':
        return <InvitePage />;
        break;
      case 'loginSlug':
        return <SlugPage />;
        break;
      case '404':
        return <FourOhFour />;
        break;
      default:
        return <MainSection />;
        break;
    }
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
