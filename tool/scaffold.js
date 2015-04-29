// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');

// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

var npmPrefix = process.env.NPM_PREFIX;

module.exports = function(npmPrefix, secondArgument){
  switch (secondArgument) {
    //--------------------------------------------------------------------------------------------------------
    case "project-homepage":
      fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/boilerplates/project-homepage', './', function (error) {
        if (error){
          return console.error(error)
        }
        childProcess.spawn('meteor', ['add', 'less', 'awatson1978:fonts-helveticas'], function(error, result){
          if(error){
            console.log("[StarryNight] Error adding meteor packages. ", error);
          }
          if(result){
            console.log('Packages installed.')
          }
        });
        console.log('Scaffold copied into place.')
      });
      break;
    //--------------------------------------------------------------------------------------------------------
    case "mobile-app":
      fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/boilerplates/mobile-app', './', function (error) {
        if (error){
          return console.error(error)
        }
        console.log('Scaffold copied over!')
      });
      break;
    //--------------------------------------------------------------------------------------------------------
    case "rest-api":
      fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/boilerplates/rest-api', './', function (error) {
        if (error){
          return console.error(error)
        }
        console.log('Scaffold copied over!')
      });
      break;
    //--------------------------------------------------------------------------------------------------------
    case "iron-router":

      childProcess.spawn('meteor', ['add', 'iron:router'], function(error, result){
        if(error){
          console.log("[StarryNight] Error adding meteor packages. ", error);
        }
        if(result){
          console.log('iron:router installed.')
        }
      });
      fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/boilerplates/iron-router', './', function (error) {
        if (error){
          return console.error(error)
        }
        console.log('Scaffold copied over!')
      });
      break;
    //--------------------------------------------------------------------------------------------------------
    case "client-server":
      fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/boilerplates/client-server', './', function (error) {
        if (error){
          return console.error(error)
        }
        console.log('Scaffold copied over!')
      });
      break;
    //--------------------------------------------------------------------------------------------------------
    default:
      console.log('No scaffold template specified.  Please specify:')
      console.log('> project-homepage');
      console.log('> client-server');
      console.log('> rest-api');
      //console.log('> mobile-app');
      break;
    break;
  }
}
