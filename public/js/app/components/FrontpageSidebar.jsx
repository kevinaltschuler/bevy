/**
 * FrontpageSidebar.jsx
 * if we get 50k investment ill chop off my left nut
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var PostActions = require('./../../post/PostActions');
var PostStore = require('./../../post/PostStore');
var BevyStore = require('./../../bevy/BevyStore');

var FrontBevyItem = require('./FrontBevyItem.jsx');

var {
  DropDownMenu,
  RaisedButton,
  FontIcon
} = require('material-ui');

var {
  Button
} = require('react-bootstrap');

var FrontpageSidebar = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array
  },

  getInitialState() {
    return {
      filter: 'top',
      sortType: 'new'
    };
  },

  sort(ev) {
    // get the sort type that was triggered
    var by = ev.target.textContent;

    // update the state immediately
    // should trigger a rerender
    this.setState({
      sortType: by
    });

    // now call action
    PostActions.sort(by);
  },

  _renderSorts() {
    // add to this string to add more types to the top
    // split function turns this string into an array
    var sort_types = 'new top events'.split(' ');
    
    // array of react components to inject
    var sorts = [];

    // for each sort type
    for(var key in sort_types) {
      var type = sort_types[key];

      // generate html attributes
      var id = type + '-btn';
      var className = 'sort-btn btn simple-btn';
      // if this type matches the current sorting mechanism (stored in the state)
      // make it active
      if(type == this.state.sortType) className += ' active';

      // the dot that separates types
      // don't generate for the last one
      var dot = (key == (sort_types.length-1)) ? '' : '•';

      sorts.push(
        <Button
          type='button'
          className={ className }
          key={ id }
          id={ id }
          onClick={ this.sort }
        > { type }
        </Button>
      );
      sorts.push(dot);
    }

    return sorts;
  },

  _renderBevies() {
    var myBevies = this.props.myBevies;
    var bevyItems = []
    for(var key in myBevies) {
      var bevy = myBevies[key];
      bevyItems.push(
        <FrontBevyItem bevy={bevy} frontBevies={this.props.frontBevies} />
      );
    }
    return bevyItems;
  },

  render() {

    var content = (
      <div className='actions'>
          <div className='sort'>
            { this._renderSorts() }
          </div>
          <div className='bevies'>
            <div className='title'>
              My Bevies
            </div>
            { this._renderBevies() }
          </div>
      </div>
    );

    return (
      <div className="panel frontpage-sidebar">
        { content }
      </div>
    );
  }
});

module.exports = FrontpageSidebar;
