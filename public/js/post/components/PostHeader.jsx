/**
 * PostHeader.jsx
 * @author albert
 */

'use strict';

var React = require('react');

var PostHeader = React.createClass({
  render() {
    return <span />
    /*return (
      <div className='panel-header'>
        <div className='profile-img' style={{backgroundImage: 'url(' + profileImage + ')',}} />
        <div className='post-details'>
          <div className='top'>
            <span className="details">
              <Button onClick={ this.startPM }>{ authorName }</Button>
            </span>
            <span className="glyphicon glyphicon-triangle-right"/>
            <span className="details">
              <a href={ '/b/' + bevy._id } id={ bevy._id } onClick={ this.onSwitchBevy }>{ bevy.name }</a>
            </span>
          </div>
          <div className="bottom">
            <span className="detail-time">{ ago }</span>
            <span className='detail-time'>{ left }</span>
          </div>
        </div>
        <div className='badges'>
          <DropdownButton
            noCaret
            pullRight
            className="post-settings"
            title={<span className="glyphicon glyphicon-option-vertical btn"></span>}>
            { deleteButton }
            { editButton }
            { pinButton }
          </DropdownButton>
        </div>
      </div>
    );*/
  }
});

module.exports = PostHeader;