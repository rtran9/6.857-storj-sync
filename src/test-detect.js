module.exports.getFileNames = function(){
	return [
		{
		    "path": "data/data2/hello.txt",
		    "bucket": "30ff4fb2dc1f7def71af1c5c"
		}
	]
}

// , {
		//     "path": "data/goodbye.txt",
		//     "bucket": "b90e0c0ace303c226c83b9e3"
		// }

// var storj = require('storj-lib');
// var fs = require('fs');

// var api = 'https://api.storj.io';
// var keypair = storj.KeyPair(fs.readFileSync('./keys/private.key').toString());//'./keys/' + cli.getKey()).toString());
// var client = storj.BridgeClient(api, {keyPair: keypair});

// module.exports.getFileNames = function(){
// 	client.getBuckets(function(err, buckets) {
// 		var p1 = new Promise(
// 			function(resolve, reject) {
// 	       		if (err) {
// 					console.log(err.message);
// 					return reject(err);
// 				}

// 				if (!buckets.length) {
// 					console.log('warn: You have not created any buckets.');
// 					return resolve([]);
// 				}

// 				// Log out info for each bucket
// 				// console.log("buckets ... ");
// 				// console.log(buckets);
// 				var returnObjs = []
// 				buckets.forEach(function(bucket,i) {
// 					// console.log(bucket.id);
// 					var bucketPromise = new Promise(
// 						function(resolve, reject) {
// 							client.listFilesInBucket(bucket.id, function(err, files) {
// 						  		if (err) {
// 						    		return reject('error:' + err.message);
// 						  		}
// 						  		if (!files.length) {
// 						    		return reject('There are no files in this bucket:' + bucket.name + " ID: " + bucket.id);
// 						  		}
// 								// Log out info for each file
// 						// 		console.log(files);
// 								files.forEach(function(file,j) {
// 									returnObjs.push({path:file.filename, bucket:bucket.id});
// 									resolve()
// 								});
// 							});
// 						}
// 					);
// 				});

// 		var allPromise = Promise.all([ fs_readFile('file1.txt'), fs_readFile('file2.txt') ])
// 		allPromise.then(console.log, console.error)
// 				// console.log(returnObjs);
// 				// resolve(returnObjs)
// 	       	}
// 	    );


// 	 //    var allPromise = Promise.all([ fs_readFile('file1.txt'), fs_readFile('file2.txt') ])
// 		// allPromise.then(console.log, console.error)


// 		// p1.then(
//   //       // Log the fulfillment value
//   //       function(val) {
//   //       	console.log(val);
//   //      //  	if (i == buckets.length-1 && j == files.length-1) {
// 		// 					// 	console.log(returnObjs);
// 		// 					// 	return resolve(returnObjs)
// 		// 					// }
            
//   //       })


// 	});
// }