'use strict';

var storj = require('storj-lib');
var fs = require('fs');
// Set the bridge api URL
var api = 'https://api.storj.io';

// Load keypair from your saved private key
var keypair = storj.KeyPair(fs.readFileSync('./keys/private.key').toString());

// Login using the keypair generated
var client = storj.BridgeClient(api, {keyPair: keypair});

//get bucket id from client
var bucketid = 'b90e0c0ace303c226c83b9e3';

client.listFilesInBucket(bucketid, function(err, files) {
  if (err) {
    return console.log('error', err.message);
  }

  if (!files.length) {
    return console.log('warn', 'There are no files in this bucket.');
  }

  // Log out info for each file
  files.forEach(function(file) {
    console.log(
      'info',
      'Name: %s, Type: %s, Size: %s bytes, ID: %s',
      [file.filename, file.mimetype, file.size, file.id]
    );
  });
});