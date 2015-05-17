// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

// request allows us to query external websites
var request = require('request');

// for _.extend()ing the process.env object
var _ = require('underscore');

module.exports = function(npmPrefix, options, callback){

  var nightwatchExitCode = 0;

  request("http://localhost:3000", function (error, httpResponse) {
     if (httpResponse) {
       console.log("Detected a meteor instance...");

        console.log("Launching nightwatch bridge...");

        // we need to launch slightly different commands based on the environment we're in
        // specifically, whether we're running locally or on a continuous integration server
        var configFileLocation;
        var nightwatchCommand;


        // set the default nightwatch executable to our starrynight installation
        nightwatchCommand = npmPrefix + '/lib/node_modules/starrynight/node_modules/nightwatch/bin/nightwatch';
        //console.log("[framekworks/nightwatch]nightwatchCommand: " + nightwatchCommand);


        // Travis has a very customizezd setup, and so lets update the location of the executable
        // as well as the location of the config file
        // if we're not on travis or a continuous-integration provider
        // lets see if we have a nightwatch specific config file specified
        // otherwise lets look to see if the user specified something with the -config flag
        // if none of our custom locations have a specific config info to use,
        // lets use the default config that's shipped with starrynight

        if(process.env.TRAVIS){
          nightwatchCommand = '/home/travis/.nvm/v0.10.38/lib/node_modules/starrynight/node_modules/nightwatch/bin/nightwatch';
          configFileLocation = npmPrefix + '/lib/node_modules/starrynight/configs/nightwatch/travis.json';
        }else if(process.env.NIGHTWATCH_CONFIG_PATH){
          configFileLocation = process.env.NIGHTWATCH_CONFIG_PATH;
        }else if(process.env.FRAMEWORK_CONFIG_PATH){
          configFileLocation = process.env.FRAMEWORK_CONFIG_PATH;
        }else{
          configFileLocation = npmPrefix + '/lib/node_modules/starrynight/configs/nightwatch/config.json';
        }

        var nightwatchArguments = [];

        if(options && options.tags){
          //nightwatchCommand = nightwatchCommand + " --tags " + options.tags;
          nightwatchArguments.push('--tags');
          nightwatchArguments.push(options.tags);
        }
        if(options && options.test){
          //nightwatchCommand = nightwatchCommand + " --test " + options.test;
          nightwatchArguments.push('--test');
          nightwatchArguments.push(options.test);
        }
        if(options && options.verbose){
          //nightwatchCommand = nightwatchCommand + " --verbose " + options.verbose;
          nightwatchArguments.push('--verbose');
          nightwatchArguments.push(options.verbose);
        }
        if(options && options.group){
          //nightwatchCommand = nightwatchCommand + " --group " + options.group;
          nightwatchArguments.push('--group');
          nightwatchArguments.push(options.group);
        }
        if(options && options.filter){
          //nightwatchCommand = nightwatchCommand + " --filter " + options.filter;
          nightwatchArguments.push('--filter');
          nightwatchArguments.push(options.filter);
        }
        if(options && options.env){
          //nightwatchCommand = nightwatchCommand + " --env " + options.env;
          nightwatchArguments.push('--env');
          nightwatchArguments.push(options.env);
        }
        if(options && options.testcase){
          //nightwatchCommand = nightwatchCommand + " --testcase " + options.testcase;
          nightwatchArguments.push('--testcase');
          nightwatchArguments.push(options.testcase);
        }
        if(options && options.config){
          nightwatchArguments.push('-c');
          nightwatchArguments.push(options.config);
        }else{
          nightwatchArguments.push('-c');
          nightwatchArguments.push(configFileLocation);
        }

        var nightwatchEnv = _.extend(process.env, {npm_config_prefix: npmPrefix});

        process.env.DEBUG && console.log("npmPrefix:           ", npmPrefix);
        process.env.DEBUG && console.log("nightwatchCommand:   ", nightwatchCommand);
        process.env.DEBUG && console.log("configFileLocation:  ", configFileLocation);
        process.env.DEBUG && console.log("nightwatchArguments: ", nightwatchArguments);


        var nightwatch = childProcess.spawn(nightwatchCommand, nightwatchArguments, {env: nightwatchEnv});
        nightwatch.stdout.on('data', function(data){
          console.log(data.toString().trim());

          // without this, travis CI won't report that there are failed tests
          if(data.toString().indexOf("✖") > -1){
            nightwatchExitCode = 1;
          }
        });
        nightwatch.stderr.on('data', function(data) {
          console.error(data.toString());
        });
        nightwatch.on('error', function(error){
          console.error('[StarryNight] ERROR spawning nightwatch. nightwatchCommand was', nightwatchCommand);
          console.log("error", error);
          throw error;
        });
        nightwatch.on('close', function(nightwatchExitCode){
          if(nightwatchExitCode === 0){
            console.log('Finished!  Nightwatch ran all the tests!');
              process.exit(nightwatchExitCode);
          }
          if(nightwatchExitCode !== 0){
            console.log('Nightwatch exited with a code of ' + nightwatchExitCode);
            process.exit(nightwatchExitCode);
          }
        });

     }
     if(error){
       console.log("No app is running on http://localhost:3000.  Try launching an app with 'meteor run'.");
       console.error(error);
       nightwatchExitCode = 2;
       //TODO: exit with error that will halt travis
       process.exit(1);
     }
  });

  /*if(nightwatchExitCode > 0){
    return callback( new Error('Nightwatch didt run and complete all its tasks'), nightwatchExitCode);
  }else{
    return callback( null, nightwatchExitCode);
  }*/

}
