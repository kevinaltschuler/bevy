/**
 * PostVideos.jsx
 *
 * component that renders youtube (and maybe other) videos
 * if the post body has a relevant link in it
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');

var youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

var PostVideos = React.createClass({
  propTypes: {
    post: React.PropTypes.object
  },

  getInitialState() {
    return {
      videos: this.findVideos(this.props.post.title)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      videos: this.findVideos(nextProps.post.title)
    });
  },

  findVideos(title) {
    var videoLinks = youtubeRegex.exec(title);
    var videos = [];
    //console.log(videoLinks);
    for(var key in videoLinks) {
      if(key != 1) continue;
      var videoLink = videoLinks[key];
      videos.push(
        <iframe
          key={ 'video:' + videoLink }
          width="100%"
          height="360px"
          src={ "https://www.youtube.com/embed/" + videoLink }
          frameBorder="0"
          allowFullScreen={ true }
        />
      );
    }
    return videos;
  },

  render() {
    return (
      <div className='post-videos'>
        { this.state.videos }
      </div>
    );
  }
});

module.exports = PostVideos;
