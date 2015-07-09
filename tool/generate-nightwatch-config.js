// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');

// so we can read files from the filesystem
var filesystem = require('fs');

// replace allows us to refactor contents of file
var replace = require('replace');

// find our files
var find = require('find');


//module.exports = function(secondArgument, thirdArgument, fourthArgument){
module.exports = function(npmPrefix, options){

  // use current directory if --root isn't specified
  if(!options.root){
    options.root = ".";
  }
  console.log("------------------------------------------");
  console.log("Searching files for .test directories.... ");



  if(options){


    // Read Our Config File Template
    fs.readJson(npmPrefix + '/lib/node_modules/starrynight/configs/nightwatch/autoconfig.json', function (err, autoConfigObject) {

      if(options.trace){
        console.log('autoConfigObject', autoConfigObject)
      }
      console.log("Updating .meteor/nightwatch.json with file paths.");


      // Search The Filesystem
      // looking for .tests directories in the filesystem
      // which don't get picked up by the meteor bundler
      find.eachdir('.tests', options.root, function(testDir){

        // Update Our New Config Object
        autoConfigObject.custom_commands_path.push(testDir);

        // Test For Subdirecotries
        find.eachdir('actions', testDir, function(actionsDir){

          // Update Our New Config Object
          autoConfigObject.custom_commands_path.push(actionsDir);
        });


      }).end(function(){

        if(options.debug){
          console.log('autoConfigObject', autoConfigObject)
        }

        // Write Our New Config File
        fs.writeJson('.meteor/nightwatch.json', autoConfigObject, {spaces: 2}, function (error, result) {
          if(error){
            console.log(error)
          }
          console.log("Writing .meteor/nightwatch.json");

        });


      });


    })


  }
}


/*
// cheerio provides DOM/jQuery utilities to lets us parse html
var cheerio = require('cheerio');


module.exports = function(secondArgument){
  //console.log( "Extracting ids from " + secondArgument);
  filesystem.readFile(secondArgument, {encoding: 'utf-8'}, function(error, data){
    if(data){
      //console.log(data.toString());
      $ = cheerio.load(data.toString())
      var ids = new Array();
      $('[id]').each(function() { //Get elements that have an id=
        ids.push($(this).attr("id")); //add id to array
      });

      var fileText = "";
      fileText += "exports.command = function() {\n";
      fileText += "  this\n";
      ids.forEach(function(id){
        fileText += '    .verify.elementPresent("#' + id + '")\n';
      });
      fileText += "  return this;\n";
      fileText += "};";

      console.log(fileText);

      //console.log(ids);
    }
    if(error){
      console.error(error);
    }
  });
}*/
