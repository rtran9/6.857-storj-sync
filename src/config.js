var platform = require('platform');
var path = require('path');

var HOME = platform !== 'win32' ? process.env.HOME : process.env.USERPROFILE;
var DATADIR = path.join(HOME, '.storjsync');

module.exports.API = 'https://api.storj.io';
module.exports.DATADIR = DATADIR;
module.exports.KEYPATH = path.join(DATADIR, 'private.key');
