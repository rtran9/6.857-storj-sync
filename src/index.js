// var detect = require('./detect');
// var createBucket = require('./create-bucket');
// var upload = require('./upload');
// var delFile = require('./delete-file');
var download = require('./download')
var fs = require('fs');

// detect.getFileNames(function(err,allFiles){
// 	//allFiles.forEach(function(filepath){
// 	//	console.log(filepath);
// 	//	fs.readFile(filepath.path,'utf8',function(err,data) {
// 	//	    console.log(data);
// 	//	});
// 	//});
// 	console.log(allFiles);
// });

// function newBucketFn(callback){
//     createBucket.newBucket(function(err, bucketID){
//       if (err) {
//         callback(err);
//       } else {
//         callback(null, bucketID);      
//       }
//     });
// }

// newBucketFn(function(err, bucketID) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(bucketID);
//     // uploadfunction(bucketID, filename) {

//     // }
//   }
// });

// var myCallback = function(err, data) {
//   if (err) throw err; // Check for the error and throw if it exists.
//   console.log('got data: '+data); // Otherwise proceed as usual.
// };

// var usingItNow = function(callback) {
//   callback(null, 'get it?'); // I dont want to throw an error, so I pass null for the error argument
// };		

var bucketID = '3d90481fdfd559f804d938a1';
// upload.uploadFile(bucketID, filepath, function(err){
// 	if (err) {
// 		console.log(err);
// 	}
// });
var fileID = '75c854d92dc44c9a042c7f18';
// delFile.deleteFile(bucketID, fileID, function(err) {
// 	if (err) {
// 		console.log(err);
// 	}
// });
var filepath = './somefolder/anontherone/whatver.txt';


download.downloadFile(bucketID, fileID, filepath, function(err) {
	if (err) {
		console.log(err);
	}
});








