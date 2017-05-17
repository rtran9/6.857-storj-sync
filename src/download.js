'use strict';

var storj = require('storj-lib');
var through = require('through');
var fs = require('fs');
var config = require('./config.js')
var mkdirp = require('mkdirp');


module.exports.downloadFile = function(bucketid, fileid, filepath, callback){

    // Load keypair from your saved private key
    var keypair = storj.KeyPair(fs.readFileSync(config.KEYPATH).toString());

    // console.login using the keypair generated
    var client = storj.BridgeClient(config.API, {keyPair: keypair});

    // Key ring to hold key used to interact with uploaded file
    var keyring = storj.KeyRing(config.DATADIR, 'keypass');

    console.log("Downloading file . . .");

    var path = filepath.substring(0, Math.max(filepath.lastIndexOf("/"), filepath.lastIndexOf("\\")));
    if (!storj.utils.existsSync(path)) {
        console.log("creating necessary directories . . . ");
        mkdirp(path, function (err) {
            if (err) console.error(err)
            else {
                // Where the downloaded file will be saved
                var target = fs.createWriteStream(filepath);

                var secret = keyring.get(fileid);

                // Prepare to decrypt the encrypted file
                var decrypter = new storj.DecryptStream(secret);
                var received = 0;
                // list of servers to exclude when finding the download server
                var exclude = [];


                // Handle Events emitted from file download stream
                target.on('finish', function() {
                  console.log('info', 'File downloaded and written to %s.', [filepath]);
                }).on('error', function(err) {
                  console.log('error', err.message);
                });

                // Download the file
                client.createFileStream(bucketid, fileid, {
                  exclude: exclude
                },function(err, stream) {
                  if (err) {
                    return console.log('error', err.message);
                    // callback(err);
                  }

                  stream.on('error', function(err) {
                    console.log('warn', 'Failed to download shard, reason: %s', [err.message]);
                    fs.unlink(filepath, function(unlinkFailed) {
                      if (unlinkFailed) {
                        console.log('error', 'Failed to unlink partial file.');
                        callback(err);
                      }

                      if (!err.pointer) {
                        return;
                      }

                    });
                  }).pipe(through(function(chunk) {
                    received += chunk.length;
                    console.log('info', 'Received %s of %s bytes', [received, stream._length]);
                    this.queue(chunk);
                  })).pipe(decrypter).pipe(target);
                });
            }
        });
    }
    else {
        // Where the downloaded file will be saved
        var target = fs.createWriteStream(filepath);

        var secret = keyring.get(fileid);

        // Prepare to decrypt the encrypted file
        var decrypter = new storj.DecryptStream(secret);
        var received = 0;
        // list of servers to exclude when finding the download server
        var exclude = [];


        // Handle Events emitted from file download stream
        target.on('finish', function() {
          console.log('info', 'File downloaded and written to %s.', [filepath]);
        }).on('error', function(err) {
          console.log('error', err.message);
        });

        // Download the file
        client.createFileStream(bucketid, fileid, {
          exclude: exclude
        },function(err, stream) {
          if (err) {
            return console.log('error', err.message);
            // callback(err);
          }

          stream.on('error', function(err) {
            console.log('warn', 'Failed to download shard, reason: %s', [err.message]);
            fs.unlink(filepath, function(unlinkFailed) {
              if (unlinkFailed) {
                console.log('error', 'Failed to unlink partial file.');
                callback(err);
              }

              if (!err.pointer) {
                return;
              }

            });
          }).pipe(through(function(chunk) {
            received += chunk.length;
            console.log('info', 'Received %s of %s bytes', [received, stream._length]);
            this.queue(chunk);
          })).pipe(decrypter).pipe(target);
        });
    }
}
