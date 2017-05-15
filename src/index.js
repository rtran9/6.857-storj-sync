var detect = require('./detect');
var fs = require('fs');

var allFiles = detect.getFileNames();
allFiles.forEach(function(filepath){
	console.log(filepath);
	fs.readFile(filepath,'utf8',function(err,data) {
	    console.log(data);
	});
});