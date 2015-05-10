
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

module.exports = function(options){
  if(options.package && options.from){
    //console.log("Creating package from component...");

    var newPackageDir = options.package.split(':')[1];
    var componentDir = path.basename(options.from)
    process.env.DEBUG && console.log("newPackageDir", newPackageDir);

    childProcess.exec("cd packages", function(err, stdout, stderr) {
      process.env.DEBUG && console.log('process.env.pwd', process.env.pwd);

      childProcess.exec("meteor create --package " + options.package, function(err, stdout, stderr) {
        process.env.DEBUG && console.log("newPackageDir", newPackageDir);

        console.log(stdout);
        console.log(err);

        if(stdout.toString().indexOf(": created in") > -1){
          console.log('Package created!')

          fs.copy(options.from, 'packages/' + newPackageDir, function (error) {
            if (error){
              return console.error(error)
            }
            console.log('Component files copied into package.')

            finder(componentDir, {root: options.from, ignoreDirs: [".meteor", ".git", ".temp"]}, function(results){
              process.env.DEBUG && console.log('results', results);

              var newFiles = "";
              results.forEach(function(result){
                newFiles += "  api.addFiles('" + path.basename(result.filepath) + "');\n";
              });
              process.env.DEBUG && console.log(newFiles);

              var searchTerm = "  api.addFiles\\('" + newPackageDir + ".js'\\);";
              process.env.DEBUG && console.log("searchTerm: " + searchTerm);

              var searchPath = './packages/' + newPackageDir;

              replace({
                regex: searchTerm,
                replacement: newFiles,
                paths: [searchPath],
                excludes: [".meteor", ".git"],
                recursive: true
              });
              console.log("Replaced some text...");
            });
          });

          fs.remove('packages/' + newPackageDir + "/" + newPackageDir + ".js", function (err) {
            if (err) return console.error(err)

            console.log('Removed default .js file.')
          });

        }
      }, function(error, result){
        if(error) console.log(error);
      });

    });

  }else{
    console.log("Please use the following syntax: ");
    console.log("starrynight create --package namespace:mypackage --from /path/to/component");
    console.log("");
  }
}
