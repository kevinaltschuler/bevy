/**
 * CreateBevyPage.jsx
 *
 * @author kevin
 */

'use strict';

// imports
var React = require('react');

var CreateNewBevyPanel = require('./CreateNewBevyPanel.jsx')

var CreateBevyPage = React.createClass({
  render() {
    return (
      <div className='register-container'>
        <div className='register-title'>
          <h1>Create a New Bevy</h1>
        </div>
        <CreateNewBevyPanel />
        <div className='back-link'>
          <a title='Login' href='/'>Back to Home</a>
        </div>
        <br/>
      </div>
    );
  }
});

module.exports = CreateBevyPage;
