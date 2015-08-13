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

var user = window.bootstrap.user;
var localStorage = window.localStorage;

_.extend(ChatStore, {

  threads: new ThreadCollection,
  openThreads: [],
  activeThread: '',

  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:

        Dispatcher.waitFor([BevyStore.dispatchToken]);  

        var user = window.bootstrap.user;

        if(_.isEmpty(user)) {
          break;
        }

        this.threads.url = constants.apiurl + '/users/' + user._id + '/threads';
        this.threads.fetch();

        break;

      case BEVY.JOIN:
      case BEVY.LEAVE:

        /*this.threads.fetch({
          reset: true,
          success: function(collection, response, options) {
            this.threads.forEach(function(thread) {
              // fetch messages
              // TODO: only get one
              thread.messages.fetch({
                reset: true,
                success: function(collection, response, options) {
                  thread.messages.sort();
                  this.trigger(CHAT.CHANGE_ALL);
                }.bind(this)
              });
            }.bind(this));
          }.bind(this)
        });*/

        break;

      case BEVY.SWITCH:
        var bevy_id = payload.bevy_id;
        $.ajax({
          method: 'get',
          url: constants.apiurl + '/bevies/' + bevy_id + '/thread',
          success: function(data) {
            if(data == undefined) return;
            this.activeThread = data._id;
            this.threads.add(data);
            this.trigger(CHAT.CHANGE_ALL);
          }.bind(this)
        });

        break;
      case CHAT.THREAD_OPEN:
        var thread_id = payload.thread_id;
        var user_id = payload.user_id;

        if(this.openThreads.indexOf(thread_id) > -1) {
          // already found it
          // just open the panel
          this.trigger(CHAT.PANEL_TOGGLE + thread_id);
          break;
        }

        if(user_id && !thread_id) {
          // just clicked on a user's name
          // is it yourself?
          if(user_id == user._id) break;
          // first look for a preexisting thread
          var thread = this.threads.find(function(thread) {
            var thread_users = _.pluck(thread.get('members'), 'user');
            thread_users = _.pluck(thread_users, '_id');
            return _.contains(thread_users, user_id) && _.contains(thread_users, user._id);
          });
          if(thread == undefined) {
            // still not found
            // let's create a thread
            var thread = this.threads.add({
              members: [
                { user: user_id },
                { user: user._id}
              ]
            });
            // save it to the server
            thread.save(null, {
              success: function(model, response, options) {
                thread.set('_id', model.get('_id'));
                thread.set('users', model.get('users'));
                thread.set('bevy', model.get('bevy'));

                // add to open threads
                this.openThreads.unshift(thread.id);

                this.trigger(CHAT.CHANGE_ALL);
              }.bind(this)
            });

            break;
          } else {
            thread_id = thread.get('_id');
          }
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
            console.log('model: ', model.toJSON());
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
    }
  },

  getAllThreads() {
    return (_.isEmpty(this.threads.models))
      ? []
      : this.threads.toJSON();
  },

  getActiveThread() {
    var thread = this.threads.get(this.activeThread);
    if(thread == undefined) {
      return {};
    }
    return thread.toJSON();
  },

  getOpenThreads() {
    var threads = [];
    this.openThreads.forEach(function(thread_id) {
      var thread = this.threads.get(thread_id);
      if(thread != undefined) threads.push(thread.toJSON());
    }.bind(this));
    return threads;
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
      if(message.author._id == user._id) return;

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
