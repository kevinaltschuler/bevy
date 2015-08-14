var React = require('react');
var Classable = require('./../../../../../node_modules/material-ui/src/js/mixins/classable');

var SvgIcon = React.createClass({

  mixins: [Classable],

  render: function() {
    var classes = this.getClasses('mui-svg-icon');

    return (
      <svg
        {...this.props}
        className={classes}
        viewBox="0 0 24 24">
        {this.props.children}
      </svg>
    );
  }

});

module.exports = SvgIcon;