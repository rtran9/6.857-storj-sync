'use strict';

var storj = require('storj-lib');
var fs = require('fs');
var uuidV4 = require('uuid/v4');
var config = require('./config.js')

// Add new bucket. Returns its bucket ID.
module.exports.newBucket = function(callback){

    // Load keypair from your saved private key
    var keypair = storj.KeyPair(fs.readFileSync(config.KEYPATH).toString());

    // Login using the keypair generated
    var client = storj.BridgeClient(config.API, {keyPair: keypair});

    var randString = uuidV4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
    var bucketInfo = {
      name: randString
    };

    client.createBucket(bucketInfo, function(err, bucket) {
      if (err) {
        // Handle error on failure.
        console.log('error', err.message);
        return callback(err)
      }

      callback(null, bucket.id);
    });
}
