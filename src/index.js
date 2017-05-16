var detect = require('./detect');
var fs = require('fs');

detect.getFileNames(function(err,allFiles){
	//allFiles.forEach(function(filepath){
	//	console.log(filepath);
	//	fs.readFile(filepath.path,'utf8',function(err,data) {
	//	    console.log(data);
	//	});
	//});
	console.log(allFiles);
});