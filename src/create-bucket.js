'use strict';

var storj = require('storj-lib');
var fs = require('fs');
var uuidV4 = require('uuid/v4');
// Set the bridge api URL
var api = 'https://api.storj.io';

// Load keypair from your saved private key
var keypair = storj.KeyPair(fs.readFileSync('./keys/private.key').toString());

// Login using the keypair generated
var client = storj.BridgeClient(api, {keyPair: keypair});

var randString = uuidV4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1' 
var bucketInfo = {
  name: randString 
};

// Add new bucket. Returns its bucket ID. 
module.exports.newBucket = function(callback){

    client.createBucket(bucketInfo, function(err, bucket) {
      if (err) {
        // Handle error on failure.
        console.log('error', err.message);
        return callback(err)
      }

      // // Log out bucket info
      // console.log(
      //   'info',
      //   'ID: %s, Name: %s, Storage: %s, Transfer: %s',
      //   [bucket.id, bucket.name, bucket.storage, bucket.transfer]
      // );
      callback(null, bucket.id);
    });
}


// // Remove bucket by id
//   client.destroyBucketById(bucket.id, function(err) {
//     if (err) {
//       // Handle error on failure.
//       return console.log('error', err.message);
//     }

//     console.log('info', 'Bucket successfully destroyed.');
//   });