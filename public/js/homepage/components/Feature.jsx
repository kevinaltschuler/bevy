/**
 * Feature.jsx
 *
 * a feature on the homepage
 *
 * @author kevin
 */

'use strict';

var React = require('react');

var Feature = React.createClass({
	propTypes: {
		title: React.PropTypes.string,
		onClick: React.PropTypes.func,
		description: React.PropTypes.string
	},

	_handleClick() {
		this.props.onClick();
	},

	render() {
		var selectedStyle = (this.props.selected == this.props.index)
		? { backgroundColor: 'rgba(44,182,115,.12)' } : {};

		var selectedTextStyle = (this.props.selected == this.props.index)
		? { color: '#2cb673'} : {};

		return (
			<div style={ selectedStyle } className='feature' onClick={ this._handleClick }>
        <div style={ selectedTextStyle } className='top'>
          { this.props.icon }
          <div  className='title'>
            { this.props.title }
          </div>
        </div>
        <div className='description'>
          { this.props.description }
        </div>
      </div>
		);
	}
});

module.exports = Feature;
