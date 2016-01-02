var User = require('./models/User');

User.find({}, function(err, users) {
  for(var key in users) {
    var user = users[key];
    user.bevies = [];
    user.boards = [];
    user.save(function(err) {
    });
  }
})
.lean();
