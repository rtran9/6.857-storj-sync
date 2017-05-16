var storj = require('storj-lib');
var fs = require('fs');

var api = 'https://api.storj.io';
var keypair = storj.KeyPair(fs.readFileSync('./private.key').toString());//'./keys/' + cli.getKey()).toString());
var client = storj.BridgeClient(api, {keyPair: keypair});

module.exports.getFileNames = function(callback){
	client.getBuckets(function(err, buckets) {
		if (err) {
			console.log(err.message);
			callback(err,null);
			return;
		}

		if (!buckets.length) {
			console.log('warn: You have not created any buckets.');
			callback(null,[])
		}

		// Log out info for each bucket
		var returnObjs = []
		buckets.forEach(function(bucket,i) {
		   	client.listFilesInBucket(bucket.id, function(err, files) {
		  		if (err) {
		    		reject('error:' + err.message);
		    		return;
		  		}
		  		if (!files.length) {
		    		reject('There are no files in this bucket:' + bucket.name + " ID: " + bucket.id);
		    		return;
		  		}
				// Log out info for each file
				files.forEach(function(file,j) {
					returnObjs.push({path:file.filename,bucket:bucket.id});
					if (i == buckets.length-1 && j == files.length-1){
						callback(null,returnObjs)
					}
				});
			});
		});
	});
}