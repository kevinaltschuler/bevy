/**
 * ChatStore.js
 *
 * @author albert
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var Dispatcher = require('./../shared/dispatcher');
var router = require('./../router');

var constants = require('./../constants');
var APP = constants.APP;
var CHAT = constants.CHAT;
var BEVY = constants.BEVY;

var BevyStore = require('./../bevy/BevyStore');

var ThreadCollection = require('./ThreadCollection');
var Thread = require('./ThreadModel');

var ChatStore = _.extend({}, Backbone.Events);

_.extend(ChatStore, {

  threads: new ThreadCollection,
  openThreads: [],
  activeThread: '',

  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:
        /*if(!_.isEmpty(window.bootstrap.user)) {
          this.threads.url = constants.apiurl + '/users/' + window.bootstrap.user._id;
          this.threads.fetch({
            success: function(collection, response, options) {
              this.trigger(CHAT.CHANGE_ALL);
            }.bind(this)
          });
        }*/
        break;

      case BEVY.JOIN:
        break;
      case BEVY.LEAVE:
        // remove the bevy chat from your list of chats
        var bevy_id = payload.bevy_id;

        var thread = this.threads.find(function($thread) {
          if(_.isEmpty($thread.bevy)) return false;
          return $thread.bevy._id == bevy_id;
        });
        if(thread == undefined) break;

        this.threads.remove(thread);
        this.trigger(CHAT.CHANGE_ALL);

        break;

      case BEVY.SWITCH:
        /*var bevy_id = payload.bevy_id;
        $.ajax({
          method: 'get',
          url: constants.apiurl + '/bevies/' + bevy_id + '/thread',
          success: function(data) {
            if(data == undefined) return;
            this.activeThread = data._id;
            this.threads.add(data);
            this.trigger(CHAT.CHANGE_ALL);
          }.bind(this)
        });*/

        break;

      case CHAT.SEND_NEW_MESSAGE:
        this.threads.add({
          _id: '-1',
          bevy: null,
          users: []
        });
        this.openThreads.push('-1');
        this.trigger(CHAT.CHANGE_ALL);
        break;

      case CHAT.CANCEL_NEW_MESSAGE:
        this.threads.remove('-1');
        this.openThreads = _.without(this.openThreads, '-1');
        this.trigger(CHAT.CHANGE_ALL);
        break;

      case CHAT.CREATE_THREAD_AND_MESSAGE:
        var added_users = payload.addedUsers;
        var message_body = payload.message_body;

        // add self to user list
        added_users.push(window.bootstrap.user);

        // remove duplicate users
        added_users = _.uniq(added_users);

        // check to see if this thread already exists
        var duplicate = this.threads.find(function($thread) {
          return _.difference(_.pluck(added_users, '_id'), _.pluck($thread.get('users'), '_id')).length <= 0;
        });
        // only dont create a new thread if this is a pm. allow for duplicate group chats
        if(duplicate != undefined && added_users.length <= 2) {
          // if we find a duplicate thread
          // push the message
          var new_message = duplicate.messages.add({
            thread: duplicate.id,
            author: window.bootstrap.user._id,
            body: message_body
          });
          new_message.save();
          // self populate message
          new_message.set('author', window.bootstrap.user);

          // close the new thread panel
          this.threads.remove('-1');
          this.openThreads = _.without(this.openThreads, '-1');
          // open the thread
          this.openThreads.push(duplicate.id);

          this.trigger(CHAT.MESSAGE_FETCH + duplicate.id);
          this.trigger(CHAT.CHANGE_ALL);
          break;
        }

        // duplicate not found
        // create thread
        var thread = this.threads.add({
          type: (added_users.length > 2) ? 'group' : 'pm', // if more than 2 users (including self), then label as a group chat
          users: _.pluck(added_users, '_id') // only push _ids to server
        });
        thread.url = constants.apiurl + '/threads';
        thread.save(null, {
          success: function(model, response, options) {
            // remove the create thread panel
            this.threads.remove('-1');
            this.openThreads = _.without(this.openThreads, '-1');
            // open the new thread and self populate
            thread.set('_id', model.get('_id'));
            thread.set('users', added_users);
            this.openThreads.push(thread.id);
            // push and save the new message
            var new_message = thread.messages.add({
              thread: thread.id,
              author: window.bootstrap.user._id,
              body: message_body
            });
            // set the urls
            thread.url = constants.apiurl + '/threads/' + thread.get('_id');
            thread.messages.url = constants.apiurl + '/threads/' + thread.get('_id') + '/messages';
            new_message.save();
            // self populate message
            new_message.set('author', window.bootstrap.user);

            this.trigger(CHAT.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case CHAT.ADD_USERS:
        var thread_id = payload.thread_id;
        var users = payload.users;

        var thread = this.threads.get(thread_id);
        if(thread == undefined) break;
        if(thread.get('type') == 'bevy') break; // dont add users to bevy threads. shouldnt happen anyways

        // merge user lists
        var thread_users = thread.get('users');
        thread_users = _.union(thread_users, users);

        if(thread.get('type') == 'pm') {
          // keep the pm and create a new group chat thread
          var thread = this.threads.add({
            type: 'group',
            users: _.pluck(thread_users, '_id')
          });
          thread.url = constants.apiurl + '/threads';
          thread.save(null, {
            success: function(model, response, options) {
              // open the new thread and self populate
              thread.set('_id', model.get('_id'));
              thread.set('users', thread_users);
              this.openThreads.push(thread.id);
              // set the urls
              thread.url = constants.apiurl + '/threads/' + thread.get('_id');
              thread.messages.url = constants.apiurl + '/threads/' + thread.get('_id') + '/messages';

              this.trigger(CHAT.CHANGE_ALL);
            }.bind(this)
          });
        } else {
          // just add the user and save to server
          thread.save({
            users: _.pluck(thread_users, '_id')
          }, {
            patch: true,
            success: function(model, response, options) {
              // simulate population of users field
              thread.set('users', thread_users);
              this.trigger(CHAT.CHANGE_ALL);
            }.bind(this)
          });
        }
        break;
      
      case CHAT.REMOVE_USER:
        var thread_id = payload.thread_id;
        var user_id = payload.user_id;

        var thread = this.threads.get(thread_id);
        if(thread == undefined) break;

        // remove user 
        var thread_users = _.reject(thread.get('users'), function($user) {
          return $user._id == user_id;
        });
        if(thread_users.length == thread.get('users').length) break; // nothing changed

        thread.save({
          users: _.pluck(thread_users, '_id')
        }, {
          patch: true,
          success: function(model, response, options) {
            // simulate population of users field
            thread.set('users', thread_users);

            if(user_id == window.bootstrap.user._id) {
              // if you're removing yourself, then remove the thread from our list
              this.threads.remove(thread_id);
            }
            this.trigger(CHAT.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case CHAT.DELETE_THREAD:
        var thread_id = payload.thread_id;

        var thread = this.threads.remove(thread_id);
        if(thread == undefined) break;

        thread.url = constants.apiurl + '/threads/' + thread.get('_id');
        thread.destroy({
          success: function(model, response, options) {
            this.trigger(CHAT.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case CHAT.EDIT_THREAD:
        var thread_id = payload.thread_id;

        var thread = this.threads.get(thread_id);
        if(thread == undefined) break;

        var name = payload.name || thread.get('name');
        var image_url = payload.image_url || thread.get('image_url');

        var tempBevy = thread.get('bevy');
        var tempUsers = thread.get('users');

        thread.save({
          name: name,
          image_url: image_url
        }, {
          patch: true,
          success: function(model, response, options) {
            // repopulate
            thread.set('users', tempUsers);
            thread.set('bevy', tempBevy);
            this.trigger(CHAT.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case CHAT.START_PM:
        var user_id = payload.user_id;
        var my_id = window.bootstrap.user._id;

        if(user_id == my_id) break; // dont allow chatting with self

        var thread = this.threads.find(function($thread) {
          var $users = $thread.get('users');
          if($thread.get('type') != 'pm') return false;
          if(_.findWhere($users, { _id: user_id }) == undefined) return false;
          return true;
        });

        if(thread == undefined) {
          // create thread
          thread = this.threads.add({
            type: 'pm',
            users: [user_id, my_id]
          });
          // save to server
          thread.url = constants.apiurl + '/threads';
          thread.save(null, {
            success: function(model, response, options) {
              thread.set('_id', model.id);
              this.openThreads.push(thread.id);
              // set the messages url
              thread.messages.url = constants.apiurl + '/threads/' + thread.get('_id') + '/messages';
              this.trigger(CHAT.CHANGE_ALL);
            }.bind(this)
          });
        } else {
          this.openThread(thread.id);
        }
        break;

      case CHAT.START_BEVY_CHAT:
        var bevy_id = payload.bevy_id;

        var thread = this.threads.find(function($thread) {
          var bevy = $thread.get('bevy');
          if(_.isEmpty(bevy)) return false;
          return bevy._id == bevy_id;
        });

        if(thread == undefined) break;

        this.openThread(thread.id);

        break;

      case CHAT.THREAD_OPEN:
        var thread_id = payload.thread_id;
        this.openThread(thread_id);
        break;

      case CHAT.PANEL_CLOSE:
        var thread_id = payload.thread_id;

        var index = this.openThreads.indexOf(thread_id);
        if(index > -1) {
          this.openThreads.splice(index, 1);
        }

        this.trigger(CHAT.CHANGE_ALL);
        break;

      case CHAT.MESSAGE_CREATE:
        var thread_id = payload.thread_id;
        var author = payload.author;
        var body = payload.body;

        var thread = this.threads.get(thread_id);
        var message = thread.messages.add({
          thread: thread_id,
          author: author._id,
          body: body
        });
        message.save(null, {
          success: function(model, response, options) {
            message.set('_id', model.id);
            message.set('author', model.get('author'));
            message.set('created', model.get('created'));
            this.trigger(CHAT.MESSAGE_FETCH + thread_id);
          }.bind(this)
        });

        break;

      case CHAT.MESSAGE_FETCH_MORE:
        var thread_id = payload.thread_id;
        var thread = this.threads.get(thread_id);

        if(thread == undefined) return;

        var message_count = thread.messages.models.length;
        //console.log(message_count);
        // set query variable
        thread.messages.url += ('?skip=' + message_count);
        thread.messages.fetch({
          remove: false,
          success: function(collection, response, options) {
            thread.messages.sort();
            this.trigger(CHAT.MESSAGE_FETCH + thread_id);
          }.bind(this)
        });
        // reset url
        thread.messages.url = constants.apiurl + '/threads/' + thread.id + '/messages';

        break;
      case CHAT.UPDATE_IMAGE:
        var thread_id = payload.thread_id;
        var url = payload.url;
        var thread = this.threads.get(thread_id);
        if(thread == undefined) break;

        thread.save({
          image_url: url
        }, {
          patch: true,
          success: function(model, response, options) {
            this.trigger(CHAT.CHANGE_ALL);
          }.bind(this)
        });
        break;
    }
  },

  openThread(thread_id) {
    if(this.openThreads.indexOf(thread_id) > -1) {
      // already found it
      // just open the panel
      this.trigger(CHAT.PANEL_TOGGLE + thread_id);
      return;
    }

    var thread = this.threads.get(thread_id);
    if(thread == undefined) return;

    // fetch messages
    thread.messages.fetch({
      remove: false,
      success: function(collection, response, options) {
        thread.messages.sort();
        this.trigger(CHAT.MESSAGE_FETCH + thread_id);
      }.bind(this)
    });

    this.openThreads.push(thread_id);

    this.trigger(CHAT.CHANGE_ALL);
  },

  getAllThreads() {
    //this.threads.sort();
    return this.threads.toJSON();
  },

  getActiveThread() {
    /*var thread = this.threads.get(this.activeThread);
    if(thread == undefined) {
      return {};
    }
    return thread.toJSON();*/
    return {};
  },

  getOpenThreads() {
    var threads = [];
    this.openThreads = _.uniq(this.openThreads); // remove duplicates here
    this.openThreads.forEach(function(thread_id) {
      var thread = this.threads.get(thread_id);
      if(thread != undefined) threads.push(thread.toJSON());
    }.bind(this));
    return threads;
  },

  getThreadName(thread_id) {
    var thread = this.threads.get(thread_id);
    if(thread == undefined) return 'thread not found';
    return thread.getName();
  },
  getThreadImageURL(thread_id) {
    var thread = this.threads.get(thread_id);
    if(thread == undefined) return '/img/logo_100.png';
    return thread.getImageURL();
  },

  getMessages(thread_id) {
    var thread = this.threads.get(thread_id);
    if(thread == undefined) {
      // thread not found
      return [];
    } else {
      return thread.messages.toJSON();
    }
  },

  getLatestMessage(thread_id) {
    var thread = this.threads.get(thread_id);
    if(thread == undefined) {
      return {};
    }
    var message = thread.messages.at(thread.messages.length - 1);
    if(message == undefined) return {};
    else return message.toJSON();
  },

  addMessage(message) {
    var thread = this.threads.get(message.thread);
    if(thread == undefined) {
      // fetch new threads - it was probably just created
      this.threads.fetch({
        reset: true,
        success: function(threads, response, options) {

          thread = this.threads.get(message.thread);

          if(thread == undefined) {
            // now it doesn't exist
            return;
          } else {
            // fetch messages
            thread.messages.fetch({
              reset: true,
              success: function(collection, response, options) {
                thread.messages.sort();
                this.trigger(CHAT.MESSAGE_FETCH + message.thread);
              }.bind(this)
            });

            // push to open threads if it isn't already
            if(this.openThreads.indexOf(message.thread._id) == -1) {
              this.openThreads.push(message.thread);
            }

            // add the message
            thread.messages.add(message);

            this.trigger(CHAT.CHANGE_ALL);
            this.trigger(CHAT.MESSAGE_FETCH + message.thread);
            // toggle the panel
            this.trigger(CHAT.PANEL_TOGGLE + message.thread);
          }
        }.bind(this)
      });

      return;
    } else {
      // dont get the message you just added
      // TODO: do this on the server?
      if(message.author._id == window.bootstrap.user._id) return;

      // open the panel if it isn't already
      if(this.openThreads.indexOf(message.thread) == -1) {
        this.openThreads.push(message.thread);
        this.trigger(CHAT.CHANGE_ALL);
      }

      if(thread.messages.length <= 0) {
        thread.messages.fetch({
          reset: true,
          success: function(collection, response, options) {
            thread.messages.sort();
            this.trigger(CHAT.MESSAGE_FETCH + message.thread);
          }.bind(this)
        });
      }

      thread.messages.add(message);
      this.trigger(CHAT.MESSAGE_FETCH + message.thread);
      // toggle the panel
      this.trigger(CHAT.PANEL_TOGGLE + message.thread);
    }
  }
});

// fetch threads
ChatStore.threads.reset(window.bootstrap.threads);
ChatStore.threads.forEach(function(thread) {
  // fetch messages
  // TODO: only get one
  thread.messages.fetch({
    reset: true,
    success: function(collection, response, options) {
      thread.messages.sort();
      this.trigger(CHAT.CHANGE_ALL);
    }.bind(this)
  });
}.bind(ChatStore));

Dispatcher.register(ChatStore.handleDispatch.bind(ChatStore));

module.exports = ChatStore;
