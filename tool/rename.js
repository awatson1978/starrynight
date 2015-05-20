// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');

// find-files allows us to -rename
var finder = require('find-files');

// replace allows us to refactor contents of file
var replace = require('replace');


//module.exports = function(secondArgument, thirdArgument, fourthArgument){
module.exports = function(options){
  if(!options.root){
    options.root = ".";
  }
  console.log("------------------------------------------");
  console.log("Searching files.... ");

  if(options){
    if(options.from && options.to){
        finder(options.from, {root: options.root, ignoreDirs: [".meteor", ".git", ".temp"]}, function(results){
          //console.log('results', results);\

          console.log("");
          console.log("------------------------------------------");
          console.log("Renamed files...");
          console.log("");
          results.forEach(function(result){
            // console.log('result.filepath', result.filepath);

            // many component directories will have subfiles with the same name
            // we need to run the replace twice - to replace the directory name
            // and then to replace the file name.

            var newresult = result.filepath.replace(options.from, options.to);
            var finalPath = newresult.replace(options.from, options.to);

            fs.move(result.filepath, finalPath, function(error, result){
              console.log('error', error);
            });

            console.log(finalPath);

          });
        });

        console.log('Done renaming files!');
    }
  }  
}
