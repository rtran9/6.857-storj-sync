'use strict';

var storj = require('storj-lib');
// var createBucket = require('./create-bucket');
// var detect = require('./test-detect');
var fs = require('fs');
// Set the bridge api URL
var api = 'https://api.storj.io';

// Load keypair from your saved private key
// TODO: get private key from client
var keypair = storj.KeyPair(fs.readFileSync('./keys/private.key').toString());

// How many pieces of the file can be uploaded at once
var concurrency = 6;

// console.login using the keypair generated
var client = storj.BridgeClient(api, {
  keyPair: keypair,
  concurrency: concurrency // Set upload concurrency
});


// var allFiles = detect.getFileNames(); // returns an array of objects


// Key ring to hold key used to interact with uploaded file
var keyring = storj.KeyRing('./', 'keypass');


module.exports.uploadFile = function(bucketID, filepath, callback){
    // Path to temporarily store encrypted version of file to be uploaded
    var tmppath = './' + filepath + '.crypt';
    // Prepare to encrypt file for upload
    var secret = new storj.DataCipherKeyIv();
    var encrypter = new storj.EncryptStream(secret);
    //Encrypt the file to be uploaded and store it temporarily
    fs.createReadStream(filepath)
      .pipe(encrypter)
      .pipe(fs.createWriteStream(tmppath)).on('finish', function() {

      // Create token for uploading to bucket by bucketID
      client.createToken(bucketID, 'PUSH', function(err, token) {
        if (err) {
          console.log('error', err.message);
          callback(err);
        }

        // Store the file using the bucket id, token, and encrypted file
        client.storeFileInBucket(bucketID, token.token, tmppath, function(err, file) {
          if (err) {
            console.log('error', err.message);
            callback(err);
          }

          // Save key for access to download file
          keyring.set(file.id, secret);

          console.log(
            'info',
            file
            // file is object of the following form :
            // { frame: '591c02e4c4c5a40001ebab19',
            //   bucket: '8a1f4109578856a5626a5990',
            //   created: '2017-05-17T08:00:19.799Z',
            //   renewal: '2017-08-15T08:00:19.799Z',
            //   mimetype: 'text/plain',
            //   filename: 'testing.txt',
            //   id: 'da597a66c0c56b68e1a5017a',
            //   size: 7 }
          );
          return file
        });
      });
    });
}






