/**
 * FrontBevyItem.jsx
 *
 * frontbevy is such a bad variable name
 *
 * @author albert
 * @author kevin
 */

'use strict';

// imports
var React = require('react');
var _ = require('underscore');
var Ink = require('react-ink');

var router = require('./../../router');

var PostActions = require('./../../post/PostActions');
var PostStore = require('./../../post/PostStore');

var rbs = require('react-bootstrap');
var Button = rbs.Button;
var ButtonGroup = rbs.ButtonGroup;
var Input = rbs.Input;

var mui = require('material-ui');
var FontIcon = mui.FontIcon;
var TextField = mui.TextField;
var Checkbox = mui.Checkbox;
var IconButton = mui.IconButton;

var FrontBevyItem = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object,
    frontBevies: React.PropTypes.array
  },

  handleCheck(ev, checked) {
    var bevyId = this.props.bevy._id;
    var frontBevies = this.props.frontBevies;

    if(_.find(frontBevies, function($bevyId) { return bevyId == $bevyId }) == undefined) 
      frontBevies.push(bevyId);
    
    else 
      frontBevies = _.reject(frontBevies, function($bevyId) { return bevyId == $bevyId  });

    console.log(frontBevies);
    

    PostActions.updateFrontBevies(frontBevies);
  },

  render() {
    var bevy = this.props.bevy;
    var image_url = (_.isEmpty(bevy.image_url)) ? '/img/logo_100.png' : bevy.image_url;

    var bevyItem = (
      <Checkbox 
        name={bevy.name} 
        label={bevy.name} 
        className='bevy-btn'
        style={{width: '100%', color: 'rgba(0,0,0,.6)'}}
        defaultChecked={true}
        iconStyle={{
          fill: '#666',
          backgroundSize: '100px auto',
          backgroundPosition: 'center'
        }}
        labelStyle={{
          maxWidth: '120px',
          wordWrap: 'break-word'
        }}
        onCheck={this.handleCheck}
       >
       </Checkbox>
    );

    return (
      <div style={{width: '90%'}}>
        {bevyItem}
      </div>
    );
  }
});

module.exports = FrontBevyItem;