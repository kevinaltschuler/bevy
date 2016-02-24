/**
 * PostSort.jsx
 *
 * Sort posts with this handy neat little bar
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  Input
} = require('react-bootstrap');

var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');

let sortTypes = [
  'new', 'top'
];
let sortTypeLabels = [
  'Most Recent', 'Top Rated'
];
let dateRanges = [
  'day', 'week', 'month', 'all'
];
let dateRangeLabels = [
  'Last 24 hours', 'Last week', 'Last month', 'All time'
];

var PostSort = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object
  },

  // grab initial sorting mechanism
  // should default to 'top' and 'asc'
  getInitialState() {
    return {
      sortType: sortTypes[0],
      dateRange: dateRanges[0]
    }
  },

  onChange(ev) {
    ev.preventDefault();
    let type = this.refs.type.getValue();
    this.setState({ sortType: type });
    this.sort(type, this.state.dateRange)
  },

  onDateChange(ev) {
    ev.preventDefault();
    let date = this.refs.date.getValue();
    this.setState({ dateRange: date });
    this.sort(this.state.sortType, date);
  },

  sort(type, date) {
    PostActions.sort(type, date);
  },

  renderTypePicker() {
    let optionItems = [];
    for(var key in sortTypes) {
      optionItems.push(
        <option
          key={ 'sort-type:' + key }
          value={ sortTypes[key] }
        >
          { sortTypeLabels[key] }
        </option>
      );
    }

    return (
      <Input
        ref='type'
        type='select'
        value={ this.state.sortType }
        onChange={ this.onChange }
      >
        { optionItems }
      </Input>
    );
  },

  renderDatePicker() {
    if(this.state.sortType != 'top') return <div />;
    let optionItems = [];
    for(var key in dateRanges) {
      optionItems.push(
        <option
          key={ 'date-range:' + key }
          value={ dateRanges[key] }
        >
          { dateRangeLabels[key] }
        </option>
      );
    }
    return (
      <Input
        ref='date'
        type='select'
        value={ this.state.dateRange }
        onChange={ this.onDateChange }
      >
        { optionItems }
      </Input>
    );
  },

  render() {
    return (
      <div className='sort-container'>
        { this.renderTypePicker() }
        { this.renderDatePicker() }
      </div>
    );
  }
});

module.exports = PostSort;
