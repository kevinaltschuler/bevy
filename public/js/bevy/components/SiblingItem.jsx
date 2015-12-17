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

var React = require('react');
var {
  FontIcon,
  TextField,
  Checkbox,
  IconButton,
  FlatButton
} = require('material-ui');
var CobevyModal = require('./CobevyModal.jsx');

var _ = require('underscore');
var router = require('./../../router');
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

    var siblings = _.reject(this.props.activeBevy.siblings, function($sibling) {
      return $sibling._id == bevy._id;
    });

    BevyActions.update(
      this.props.activeBevy._id,
      null,
      null,
      null,
      null,
      siblings
    );
  },

  render() {
    var bevy = this.props.bevy;

    if(_.isEmpty(bevy.name)) {
      return <div />;
    }

    var image_url = (_.isEmpty(bevy.image))
      ? '/img/logo_100.png'
      : bevy.image.path;

    var bevyButton = (this.props.editing)
    ? (
      <div className='sibling-edit'>
        <a
          href=''
          onClick={this.removeSibling}
          className='glyphicon glyphicon-remove'
        />
        <span className='bevy-name'>{ bevy.name }</span>
      </div>
    )
  : (
      <FlatButton
        linkButton={true}
        href={ bevy.url }
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          padding: '5px 10px'
        }}
        className='sibling-item'
        labelStyle={{ fontWeight: '700' }}
      >
        <div
          className='bevy-image'
          style={{ backgroundImage: 'url(' + image_url + ')' }}
        />
        <span className='bevy-name'>{ bevy.name }</span>
      </FlatButton>
    );

    return (
      <div style={{ width: '100%' }}>
        { bevyButton }
      </div>
    );
  }
});

module.exports = SiblingItem;
