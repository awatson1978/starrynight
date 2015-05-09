
// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');

// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

// so we can find the NODE_PATH
var path = require('path');

// find-files allows us to -rename
var finder = require('find-files');

// replace allows us to refactor contents of file
var replace = require('replace');

module.exports = function(packageName, componentLocation){
  if(packageName && componentLocation){
    //console.log("Creating package from component...");

    var packageDir = packageName.split(':')[1];

    childProcess.exec("meteor create --package " + packageName, function(err, stdout, stderr) {
      //console.log(stdout);
      if(stdout.toString().indexOf(": created in") > -1){
        console.log('Package created!')

        fs.copy(componentLocation, 'packages/' + packageDir, function (error) {
          if (error){
            return console.error(error)
          }
          console.log('Component files copied into package.')
        });

        fs.remove('packages/' + packageDir + "/" + packageDir + ".js", function (err) {
          if (err) return console.error(err)

          console.log('Removed default .js file.')
        });

        finder(packageDir, {root: componentLocation, ignoreDirs: [".meteor", ".git", ".temp"]}, function(results){
          //console.log('results', results);

          var newFiles = "";
          results.forEach(function(result){
            newFiles += "  api.addFiles('" + path.basename(result.filepath) + "');\n";
          });
          //console.log(newFiles);

          var searchTerm = "  api.addFiles\\('" + packageDir + ".js'\\);";
          //console.log("searchTerm: " + searchTerm);

          var searchPath = './packages/' + packageDir;

          replace({
            regex: searchTerm,
            replacement: newFiles,
            paths: [searchPath],
            excludes: [".meteor", ".git"],
            recursive: true
          });
          console.log("Replaced some files...");
        });

      }
    });


  }else{
    console.log("Please use the following syntax: ");
    console.log("starrynight create --package namespace:mypackage --from /path/to/component");
    console.log("");
  }
}
