/**
 * FrontpageSidebar.jsx
 * if we get 50k investment ill chop off my left nut
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var {
  DropDownMenu,
  RaisedButton,
  FontIcon
} = require('material-ui');
var {
  Button
} = require('react-bootstrap');
var FrontBevyItem = require('./FrontBevyItem.jsx');
var PostSort = require('./../../post/components/PostSort.jsx');

var _ = require('underscore');
var PostActions = require('./../../post/PostActions');
var PostStore = require('./../../post/PostStore');
var BevyStore = require('./../../bevy/BevyStore');

var FrontpageSidebar = React.createClass({
  propTypes: {
    frontBevies: React.PropTypes.array,
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    sortType: React.PropTypes.string
  },

  getInitialState() {
    return {
    };
  },

  _renderBevies() {
    var myBevies = this.props.myBevies;
    var bevyItems = []
    for(var key in myBevies) {
      var bevy = myBevies[key];
      bevyItems.push(
        <FrontBevyItem key={ 'frontbevyitem:' + key } bevy={bevy} frontBevies={this.props.frontBevies} />
      );
    }
    return bevyItems;
  },

  render() {

    return (
      <div className="panel frontpage-sidebar">
        <div className='actions'>
          <PostSort
            activeBevy={ this.props.activeBevy }
            sortType={ this.props.sortType }
          />
          <div className='bevies'>
            <div className='title'>
              My Bevies
            </div>
            { this._renderBevies() }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = FrontpageSidebar;
