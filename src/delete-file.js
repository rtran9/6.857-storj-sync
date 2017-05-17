'use strict';

var storj = require('storj-lib');
var fs = require('fs');
// Set the bridge api URL
var api = 'https://api.storj.io';

// Load keypair from your saved private key
var keypair = storj.KeyPair(fs.readFileSync('./keys/private.key').toString());

// console.login using the keypair generated
var client = storj.BridgeClient(api, {keyPair: keypair});

// Key ring to hold key used to interact with uploaded file
var keyring = storj.KeyRing('./', 'keypass');


module.exports.deleteFile = function(bucketID, fileID, callback){
	// Remove file from bucket
	client.removeFileFromBucket(bucketID, fileID, function(err) {
	  if (err) {
	    console.log('error', err.message);
	    callback(err);
	  }
	  console.log('info', 'File was successfully removed from bucket.');
	  // Delete key used to interact with the file from your keyring
	  keyring.del(fileID);
	});
}