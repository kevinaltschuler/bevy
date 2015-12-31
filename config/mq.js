/**
 * config/mq.js
 * @author albert
 * @flow
 */

'use strict';

exports.events = {
  NEW_BEVY: 'NEW_BEVY',
  NEW_POST: 'NEW_POST',
  NEW_COMMENT: 'NEW_COMMENT',
  POST_TO_BOARD: 'POST_TO_BOARD',
  REPLY_TO_POST: 'comment:post_reply',
  REPLY_TO_COMMENT: 'comment:comment_reply'
};
