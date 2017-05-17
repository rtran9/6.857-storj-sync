var fs = require('fs');
var path = require('path');
var uuidv4 = require('uuid/v4');
var dirTree = require('directory-tree');

var deleteFile = require('./delete-file.js')
var upload = require('./upload.js');
var bucket = require('./create-bucket.js');

var Datastore = require('nedb');
var db = new Datastore({
  filename: '.table'
});

function recurseFirstSync(parent, children) {
  children.forEach(function(child) {
    if (!child.hasOwnProperty("children")) {
      if (!(child["name"]).endsWith('.crypt')) {

        var file = {
          "parentdir": parent["path"],
          "bucketid": parent["bucketid"],
          "path": child["path"],
          "name": child["name"],
          "current": {
            "mtime": fs.statSync(child["path"])["mtime"].getTime(),
            "synctime": "timestamp",
            "hash": "hash"
          },
          "snapshots": [],
          "type": 'file'
        };

        upload.uploadFile(file["bucketid"], child["path"], function(err, res) {
          if (err) {
            console.log(err);
          } else {
            file["fileid"] = res["id"];
            db.insert(file, function(err) {
              console.log(err);
            });
          }
        });

      }
    } else {
      bucket.newBucket(function(err, bucketid) {
        if (err) {
          console.log(err);
        } else {
          var dir = {
            "path": child["path"],
            "name": child["name"],
            "bucketid": bucketid,
            "parentdir": parent["path"],
            "type": 'dir'
          };

          db.insert(dir, function(err) {
            if (err) {
              console.log(err);
            }
          });
          recurseFirstSync(dir, child["children"]);
        }
      })
    }
  });

}

function firstSync(directory) {
  var fileTree = dirTree(directory);
  var children = fileTree["children"]
  bucket.newBucket(function(err, bucketid) {
    if (err) {
      console.log(err);
    } else {
      var dir = {
        "path": fileTree["path"],
        "name": fileTree["name"],
        "bucketid": bucketid,
        "parentdir": null,
        "type": 'dir'
      };

      db.loadDatabase(function(err) {
        db.insert(dir, function(err) {
          if (err) {
            console.log(err);
          }
        });

        if (children) {
          recurseFirstSync(dir, children);
        }
      });

    }
  })
}


function recurseSync(parent, children) {
  children.forEach(function(child) {
    if (!child.hasOwnProperty("children")) {
      if (!(child["name"]).endsWith('.crypt')) {

        // check if the file already exists in the db

        db.findOne({
          "path": child["path"],
          "type": 'file'
        }, function(err, doc) {
          if (err) {
            console.log(err);
          } else {
            if (doc) {
              if (Object.keys(doc["current"]).length == 0) {
                // this means the file was previously deleted
                console.log("reborn.");
                upload.uploadFile(doc["bucketid"], doc["path"], function(err, res) {
                  if (err) {
                    console.log(err);
                  } else {
                    db.update({
                        "path": doc["path"],
                        "type": 'file'
                      }, {
                        $set: {
                          "current": {
                              "mtime": fs.statSync(child["path"])["mtime"].getTime(),
                              "synctime": (new Date()).getTime(),
                          }
                        }
                      }, {},
                      function() {});
                  }
                });

              } else {
                var mtime = fs.statSync(child["path"])["mtime"].getTime();
                if (mtime != doc["current"]["mtime"]) {
                  console.log("different");

                  // delete
                  deleteFile.deleteFile(doc["bucketid"], doc["fileid"], function(err) {
                    if (err) {
                      console.log(err)
                    }
                  });

                  //reupload
                  upload.uploadFile(doc["bucketid"], doc["path"], function(err, res) {
                    if (err) {
                      console.log(err);
                    } else {
                      db.update({
                          "path": doc["path"],
                          "type": 'file'
                        }, {
                          $set: {
                            "current": {
                              "mtime": mtime,
                              "synctime": (new Date()).getTime()
                            }
                          }
                        }, {},
                        function() {});
                    }
                  });

                } else {
                  console.log("same");
                }
              }

            } else {
              // new file
              console.log("new");

              var file = {
                "parentdir": parent["path"],
                "bucketid": parent["bucketid"],
                "path": child["path"],
                "name": child["name"],
                "current": {
                  "mtime": fs.statSync(child["path"])["mtime"].getTime(),
                  "synctime": (new Date()).getTime()
                },
                "snapshots": [],
                "type": 'file'
              };

              upload.uploadFile(file["bucketid"], child["path"], function(err, res) {
                if (err) {
                  console.log(err);
                } else {
                  file["fileid"] = res["id"];
                  db.insert(file);
                }
              });
            }
          }
        });
      } else {

      }
    } else {
      // check if directory is new
      db.findOne({
        "path": child["path"],
        "type": "dir"
      }, function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          if (doc) {
            // dir already exists
            recurseSync(doc, child["children"])
          } else {
            // dir does not exist, so make it
            console.log("new dir");
            bucket.newBucket(function(err, bucketid) {
              if (err) {
                console.log(err);
              } else {

                var dir = {
                  "path": child["path"],
                  "name": child["name"],
                  "bucketid": bucketid,
                  "parentdir": parent["path"],
                  "type": 'dir'
                };
                db.insert(dir, function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    recurseSync(dir, child["children"])
                  }
                });

              }
            });
          }
        }


      })

    }
  });
}

function getAllFiles(directory) {
  console.log(directory);
  var files = [];
  var fileTree = dirTree(directory);

  function recurseFind(children) {
    children.forEach(function(child) {
      if (!child.hasOwnProperty("children")) {
        if (!(child["name"]).endsWith('.crypt')) {
          files.push(child["path"]);
        } else {}
      } else {
        recurseFind(child["children"])
      }
    });
  }

  var children = fileTree["children"]
  if (children) {
    recurseFind(children)
  }
  return files;
}



function sync(directory) {
  // file no longer exists locally
  // delete from storj, clear current

  // file has been modified
  // new files created
  var fileTree = dirTree(directory);
  var children = fileTree["children"]

  db.loadDatabase(function(err) {
    if (children) {
      db.findOne({
        "path": fileTree["path"],
        "type": 'dir'
      }, function(err, parent) {
        if (err) {
          console.log(err);
        } else {
          recurseSync(parent, children);
        }
      });
    }
  });

  var allFiles = getAllFiles(directory);
  db.loadDatabase(function(err) {
    db.find({
      "type": "file"
    }, function(err, docs) {
      docs.forEach(function(file) {
        if (!allFiles.includes(file["path"])) {
          if (!Object.keys(file["current"]).length == 0) {
            console.log("file delete");
            deleteFile.deleteFile(file["bucketid"], file["fileid"], function() {
              db.update({
                "path": file["path"],
                "type": "file"
              }, {
                $set: {
                  "current": {}
                }
              }, {}, function() {});
            });
          }
        }
      })
    })
  })
}

setInterval(function(){sync('./data')}, 10000);
// sync('./data')
