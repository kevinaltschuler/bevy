'use strict';

exports.db = {
	URL: "mongodb://localhost:27017/#{exports.appName.toLowerCase()}_#{currentEnv}"
};
