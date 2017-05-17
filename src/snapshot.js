var sync = require('./sync.js')
var path = require('path')
var fs = require('fs')
var download = require('./download.js')

function snapshot(directory) {
  var time = (new Date()).getTime().toString();
  var name = time.concat(".table");
  var filepath = path.join('/snapshots', name);
  sync.syncDir(directory, filepath);
}

function getSnapshots(directory) {
  var snapshotPath = path.join(directory, '.storjsync', 'snapshots')
  console.log(snapshotPath);
  var snapshotFiles = fs.readdirSync(snapshotPath);
  snapshotFiles.forEach(function(snapshot) {
    var time = parseInt(snapshot.split('.')[0]);
    var date = new Date(time);
    console.log(time,date);
  });
}

function downloadSnapshot(directory, time, outputPath) {
  var tableName = time.concat(".table");
  var tablePath = path.join(directory, '.storjsync', 'snapshots', tableName);

  var Datastore = require('nedb');
  var db = new Datastore({
    filename: tablePath
  });

  db.loadDatabase(function(err) {
    if (err) {
      console.log(err);
    } else {
      db.find({"type": "file"}, function(err, docs) {
        if (err) {
          console.log(err);
        } else {
          docs.forEach(function(doc) {
            var output = path.join(outputPath, doc['path']);
            download.downloadFile(doc["bucketid"], doc['fileid'], output, function(err) {
              if (err) {
                console.log(err);
              }
            })
          })
        }
      });
    }
  });
}

module.exports.snapshot = snapshot;
module.exports.getSnapshots = getSnapshots;
module.exports.downloadSnapshot = downloadSnapshot;
