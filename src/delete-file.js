'use strict';

var storj = require('storj-lib');
var fs = require('fs');
var uuidV4 = require('uuid/v4');
var config = require('./config.js')


module.exports.deleteFile = function(bucketID, fileID, callback) {

  // How many pieces of the file can be uploaded at once
  var concurrency = 6;
  var keypair = storj.KeyPair(fs.readFileSync(config.KEYPATH).toString());

  // console.login using the keypair generated
  var client = storj.BridgeClient(config.API, {
    keyPair: keypair,
    concurrency: concurrency // Set upload concurrency
  });

  // Key ring to hold key used to interact with uploaded file
  var keyring = storj.KeyRing(config.DATADIR, 'keypass');


  // Remove file from bucket
  client.removeFileFromBucket(bucketID, fileID, function(err) {
    if (err) {
      console.log('error', err.message);
      callback(err);
    }
    console.log('info', 'File was successfully removed from bucket.');
    // Delete key used to interact with the file from your keyring
    keyring.del(fileID);
    return callback(null);
  });
}
