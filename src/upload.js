'use strict';

var storj = require('storj-lib');
var fs = require('fs');
var uuidV4 = require('uuid/v4');
var config = require('./config.js')

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
          );
          return callback(null, file)
        });
      });
    });
}
