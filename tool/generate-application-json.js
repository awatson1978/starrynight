// so we can read files from the filesystem
const filesystem = require('fs');
const fs = require('fs-extra');

module.exports = function ( npmPrefix, options ){

  var applicationJson = {};

  if (options && options.name) {
    applicationJson.name = options.name;
  }




  filesystem.readFile('.meteor/.id', {encoding: 'utf-8'}, function (error, data){
    if (data){
      var datum = data.toString();
      var lines = datum.split('\n');

      lines.forEach(function (line){
        if (options.trace) {
          console.log("line", line);
          console.log("line[0]", line[0]);
          console.log("line.length", line.length);
        }

        // don't parse comments or empty lines
        // this will assign the last id in the file
        // but there should only be one id anyhow

        if ((line[0] !== "#") && (line.length > 0)) {
          applicationJson["id"] = line;
        }
      });
      filesystem.readFile('.meteor/release', {encoding: 'utf-8'}, function (error, data){
        if (data){

          var datum = data.toString();
          var lines = datum.split('\n');

          applicationJson["release"] = lines[0];
          applicationJson["tags"] = [];

          filesystem.readFile('.meteor/platforms', {encoding: 'utf-8'}, function (error, data){
            if (data){

              applicationJson["platforms"] = [];

              var datum = data.toString();
              var lines = datum.split('\n');

              lines.forEach(function (line){
                if (options.trace) {
                  console.log("line", line);
                  console.log("line[0]", line[0]);
                  console.log("line.length", line.length);
                }

                // don't parse comments or empty lines
                if ((line[0] !== "#") && (line.length > 0)) {
                  applicationJson["platforms"].push(line);
                }
              });

              filesystem.readFile('.meteor/.finished-upgraders', {encoding: 'utf-8'}, function (error, data){
                if (data){

                  applicationJson["finished-upgraders"] = [];

                  var datum = data.toString();
                  var lines = datum.split('\n');

                  lines.forEach(function (line){
                    if (options.trace) {
                      console.log("line", line);
                      console.log("line[0]", line[0]);
                      console.log("line.length", line.length);
                    }

                    // don't parse comments or empty lines
                    if ((line[0] !== "#") && (line.length > 0)) {
                      applicationJson["finished-upgraders"].push(line);
                    }
                  });

                  filesystem.readFile('.meteor/versions', {encoding: 'utf-8'}, function (error, data){
                    if (data){
                      applicationJson["packages"] = {};

                      // data string gets generated as a long blob; need to split it at line breaks into an array
                      var packagesArray = data.toString().split(/\n/);
                      var packageName = "";
                      var packageVersion = "";


                      packagesArray.forEach(function (packageDef){
                        // find the package name and version
                        packageName = packageDef.substr(0, packageDef.indexOf('@'));
                        packageVersion = packageDef.substr(packageDef.indexOf('@') + 1, packageDef.length);

                        // don't add empty package names
                        if (packageName.length > 0){
                          console.log('packageName', packageName + ":" + packageVersion);

                          applicationJson.packages[packageName] = packageVersion;
                        }
                      });

                      console.log('/////////////////////////////////////////////');
                      console.log('applicationJson', applicationJson);

                      fs.writeJson(
                        'application.json',
                        applicationJson,
                        {spaces: 2},
                        function writing (error, result) {
                          if (error) { log.error(error); }
                          console.log('Writing application.json');
                        }
                      );

                    }
                    if (error){
                      console.error("error parsing .meteor/versions", error);
                    }
                  });
                }
                if (error){
                  console.error("error parsing .meteor/.finished-upgraders", error);
                }
              });
            }
            if (error){
              console.error("error parsing .meteor/platforms", error);
            }
          });
        }
        if (error){
          console.error("error parsing .meteor/release", error);
        }
      });
    }
    if (error){
      console.error("error parsing .meteor/.id", error);
    }
  });



};
