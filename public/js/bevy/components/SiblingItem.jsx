/**
 * SiblingItem.jsx
 *
 * beat my dad.
 * why is his name dad norman
 *
 * @author albert
 * @author kevin
 */

'use strict';

// imports
var React = require('react');
var _ = require('underscore');

var router = require('./../../router');

var mui = require('material-ui');
var FontIcon = mui.FontIcon;
var TextField = mui.TextField;
var Checkbox = mui.Checkbox;
var IconButton = mui.IconButton;
var FlatButton = mui.FlatButton;

var CobevyModal = require('./CobevyModal.jsx');

var BevyActions = require('./../BevyActions');

var SiblingItem = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    editing: React.PropTypes.bool,
    bevy: React.PropTypes.object,
    key: React.PropTypes.string
  },

  removeSibling(ev) {
    ev.preventDefault();
    var siblings = this.props.activeBevy.siblings;
    var bevy = this.props.bevy;

    var siblings = _.reject(this.props.activeBevy.siblings, function($sibling) { return $sibling == bevy._id });

    BevyActions.update(this.props.activeBevy._id, null, null, null, null, siblings);
  },

  render() {
      var bevy = this.props.bevy;
      var image_url = (_.isEmpty(bevy.image_url)) ? '/img/logo_100.png' : bevy.image_url;

      var bevyButton = (this.props.editing)
      ? (
          <div className='bevy-remove-btn'>
            <a
              href='' 
              onClick={this.removeSibling} 
              className='glyphicon glyphicon-remove'
            />
            <div
              className='bevy-image'
              style={{ backgroundImage: 'url(' + image_url + ')' }}
            />
            {bevy.name}
          </div>
        )
      : (
          <FlatButton 
            linkButton={true} 
            href={'/b/' + bevy._id}
            style={{width: '100%', display: 'flex', flexDirection: 'row', padding: '5px 10px'}}
            className='bevy-btn'
            labelStyle={{fontWeight: '700'}}
          >
            <div
              className='bevy-image'
              style={{ backgroundImage: 'url(' + image_url + ')' }}
            />
            <div style={{fontWeight: '700'}}>{bevy.name}</div>
          </FlatButton>
        );

      return <div style={{width: '100%'}}>
              { bevyButton }
            </div>;
  }
});

module.exports = SiblingItem;