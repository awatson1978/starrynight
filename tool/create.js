
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

    // Figure out Package Directory Name
    var newPackageDir = options.package.split(':')[1];
    var componentDir = path.basename(options.from)

    if(option.debug){
      console.log("newPackageDir: ", newPackageDir);
      console.log("componentDir:  ", componentDir);
    }

    //
    childProcess.exec("cd packages", function(err, stdout, stderr) {
      if(option.debug){
        console.log('process.env.pwd', process.env.pwd);
      }

      childProcess.exec("meteor create --package " + options.package, function(err, stdout, stderr) {
      if(option.debug){
        console.log(stdout);
        console.log(err);
      }


        if(stdout.toString().indexOf(": created in") > -1){
          console.log('Package created!')

          fs.copy(options.from, 'packages/' + newPackageDir, function (error) {
            if (error){
              return console.error(error)
            }
            console.log('Component files copied into package.')

            finder(componentDir, {root: options.from, ignoreDirs: [".meteor", ".git", ".temp"]}, function(results){
              //if(option.debug){
                console.log('results', results);
              //}

              var newFiles = "";
              results.forEach(function(result){
                newFiles += "  api.addFiles('" + path.basename(result.filepath) + "', ['client']);\n";
              });
              //if(option.debug){
                console.log(newFiles);
              //}

              var searchTerm = "  api.addFiles\\('" + newPackageDir + ".js'\\);";
              //if(option.debug){
                console.log("searchTerm: " + searchTerm);
              //}

              var searchPath = './packages/' + newPackageDir;

                console.log("searchPath: " + searchPath);

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
