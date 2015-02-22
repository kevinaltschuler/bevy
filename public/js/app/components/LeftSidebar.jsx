'use strict';

var React = require('react');

var CreateNewBevy = require('./../../modals/components/CreateNewBevy.jsx');

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var Button = rbs.Button;
var ButtonGroup = rbs.ButtonGroup;
var ModalTrigger = rbs.ModalTrigger;

var mui = require('material-ui');
var IconButton = mui.IconButton;

module.exports = React.createClass({
      render: function() {
        return <ButtonGroup className="col-sm-3 hidden-xs btn-group left-sidebar" role="group">
                <text className="btn-group-text">
                  <Button type="button" className="sort-btn btn active">Front Page</Button>
                  <br/>
                    <Button type="button" className="sort-btn btn">New England Melee</Button>
                  <br/>
                  <Button type="button" className="sort-btn btn">
                    Burlap <Badge>12</Badge>
                  </Button>
                  <br/>
                  <Button type="button" className="sort-btn btn">
                    Neu Frisbee <Badge>4</Badge>
                  </Button> 
                  <br/>
                  <Button type="button" className="sort-btn btn">Bevy Team</Button>
                  <br/>
                  <ModalTrigger modal={<CreateNewBevy />}>
                    <IconButton iconClassName="glyphicon glyphicon-plus" tooltip="Create new bevy"/>
                  </ModalTrigger>
                </text>
               </ButtonGroup>;
             }
});