var storj = require('storj-lib');
var fs = require('fs');

var api = 'https://api.storj.io';
var keypair = storj.KeyPair(fs.readFileSync('./private.key').toString());//'./keys/' + cli.getKey()).toString());
var client = storj.BridgeClient(api, {keyPair: keypair});

module.exports.getFileNames = function(){
	client.getBuckets(function(err, buckets) {
	  if (err) {
	    // Handle error on failure.
	    return console.log('error', err.message);
	  }

	  if (!buckets.length) {
	    return console.log('warn', 'You have not created any buckets.');
	  }

	  // Log out info for each bucket
	  buckets.forEach(function(bucket) {
	    console.log(
	      'info',
	      'ID: %s, Name: %s, Storage: %s, Transfer: %s',
	      bucket.id, bucket.name, bucket.storage, bucket.transfer
	    );
	  });
	});
	return [{path:'data/hello.txt',bucket:0}]
}