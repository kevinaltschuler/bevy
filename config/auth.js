/**
 * secrets.js
 * @author albert
 * @flow
 */

var keys = {
  oauth_clients: {
    web: 'THE-ROCK-WE-ALL-PUSH',
    ios: 'BY-THE-LIGHT-OF-THE-MOON',
    android: 'THE-DOG-OF-THE-SOUTH',
  },
  jwt: 'WHEN-THE-MORNING-STARS-SANG-TOGETHER'
};

module.exports = {
  clients: {
    web: "web",
    ios: "ios",
    android: "android"
  },
  keys: keys,
  expiresIn: {
    seconds: 60 * 60 * 24 * 7, // 1 week
    milliseconds: 1000 * 60 * 60 * 24 * 7,
    string: "7d"
  }
};
