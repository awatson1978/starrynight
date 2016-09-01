// fs-extra lets us recursively copy directories and do advance file management
const fs = require('fs-extra');

// so we can read files from the filesystem
// var filesystem = require('fs');     // unused ??

// replace allows us to refactor contents of file
// var replace = require('replace');   // unused ??

// find our files
const find = require('find');

// nodeJs logging capability
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'starrynight'});
log.level('warn');


// module.exports = function(secondArgument, thirdArgument, fourthArgument){
module.exports = function autoconfigureStarrynight (npmPrefix, options) {
  // use current directory if --root isn't specified
  if (!options.root) {
    options.root = '.';
  }

  if (options) {
    if (options.trace) { log.level(options.trace); }

    // Choose a config file.
    var configFile;
    if (options.nightwatch) {
      configFile = npmPrefix + '/lib/node_modules/starrynight/configs/nightwatch/nightwatch.json';
    } else {
      configFile = npmPrefix + '/lib/node_modules/starrynight/configs/nightwatch/starrynight.json';
    }

    // Read Our Config File Template
    fs.readJson(
      configFile,
      function updateNightWatchJson (err, autoConfigObject) {
        if (err) { log.error(err); }
        if (options.mnml || options.minimal) {
          log.info('------------------------------------------');
          log.info('Removing "custom path"  elements     .... ');

          delete autoConfigObject.custom_commands_path;
          delete autoConfigObject.custom_assertions_path;

          fs.writeJson(
            '.meteor/starrynight.json',
            autoConfigObject,
            {spaces: 2},
            function writing (error, result) {
              if (error) { log.error(error); }
              log.info('Writing .meteor/starrynight.json');
              log.debug('writeJson result was : ' + result);
            }
          );

        } else {
          log.info('------------------------------------------');
          log.info('Searching files for .test and command directories.... ');

          // Search The Filesystem
          autoConfigObject.custom_commands_path = [];

          // looking for commands directories in the filesystem
          // which don't get picked up by the meteor bundler
          find.eachdir('commands', options.root, function (commandsDir) {
            log.debug('commandsDir', commandsDir);
            autoConfigObject.custom_commands_path.push(commandsDir);

            find.eachdir('actions', commandsDir, function (actionsDir) {
              autoConfigObject.custom_commands_path.push(actionsDir);
            });
            find.eachdir('components', commandsDir, function (componentsDir) {
              autoConfigObject.custom_commands_path.push(componentsDir);
            });
            find.eachdir('methods', commandsDir, function (methodsDir) {
              autoConfigObject.custom_commands_path.push(methodsDir);
            });
            find.eachdir('api/meteor', commandsDir, function (apiDir) {
              autoConfigObject.custom_commands_path.push(apiDir);
            });

          }).end( function (){

            // looking for .tests directories in the filesystem
            // which don't get picked up by the meteor bundler
            find.eachdir('.tests', options.root, function (testDir) {

              log.debug('testDir', testDir);

              // Update Our New Config Object
              autoConfigObject.custom_commands_path.push(testDir);
              // Test For Subdirecotries
              find.eachdir('actions', testDir, function (actionsDir) {
                // Update Our New Config Object
                autoConfigObject.custom_commands_path.push(actionsDir);
              });

            }).end( function () {
              log.debug('autoConfigObject', autoConfigObject);

              // Write Our New Config File
              fs.writeJson(
                '.meteor/starrynight.json',
                autoConfigObject,
                {spaces: 2},
                function writing (error, result) {
                  if (error) { log.error(error); }
                  log.info('Writing .meteor/starrynight.json');
                  log.debug('writeJson result was : ' + result);
                }
              );
            });


          });






        }

        //log.info('Updated .meteor/starrynight.json.');
        console.log('Updated .meteor/starrynight.json.');
      }
    );
  }
};
