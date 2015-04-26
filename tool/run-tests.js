
// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

// request allows us to query external websites
var request = require('request');

// for _.extend()ing the process.env object
var _ = require('underscore');


module.exports = function(npmPrefix, testType){
  switch (testType) {


    //------------------------------------------------------------------------------------------
    case "end-to-end":
      console.log("Running end-to-end tests...");
      console.log("NOTICE:  This is very experimental integration of the meteor-e2e package!  ");
      console.log("NOTICE:  See the following repo for more details about setting it up:");
      console.log("NOTICE:  https://github.com/awatson1978/e2e");

      childProcess.exec("selenium", function(err, stdout, stderr) {
        console.log(stdout);

        childProcess.exec('SOURCE_TESTS_DIR="tests/meteor-e2e" meteor-e2e --local --browsers=firefox', function(err, stdout, stderr) {
          console.log(stdout);
        });

      });
    break;

    //------------------------------------------------------------------------------------------
    case "acceptance":
      console.log("Launching StarryNight.  Analyzing meteor environment...");

      request("http://localhost:3000", function (error, httpResponse) {
         if (httpResponse) {
           console.log("Detected a meteor instance...");

            console.log("Launching nightwatch bridge...");

            // we need to launch slightly different commands based on the environment we're in
            // specifically, whether we're running locally or on a continuous integration server
            var configFileLocation;
            var nightwatchCommand;
            if(process.env.TRAVIS){
              // the command paths to run if we're on travis.org
              configFileLocation = npmPrefix + '/lib/node_modules/starrynight/configs/nightwatch/travis.json';
              nightwatchCommand = '/home/travis/.nvm/v0.10.38/lib/node_modules/starrynight/node_modules/nightwatch/bin/nightwatch';
            }else{
              // the command paths if we're running locally
              configFileLocation = npmPrefix + '/lib/node_modules/starrynight/configs/nightwatch/config.json';
              nightwatchCommand = npmPrefix + '/lib/node_modules/starrynight/node_modules/nightwatch/bin/nightwatch';
            }

            var nightwatchEnv = _.extend(process.env, {npm_config_prefix: npmPrefix});
            var frameworkExitCode = 0;
            var nightwatch = childProcess.spawn(nightwatchCommand, ['-c', configFileLocation], {env: nightwatchEnv});
            nightwatch.stdout.on('data', function(data){
              console.log(data.toString().trim());

              // without this, travis CI won't report that there are failed tests
              if(data.toString().indexOf("✖") > -1){
                frameworkExitCode = 1;
              }
            });
            nightwatch.stderr.on('data', function(data) {
              console.error(data.toString());
            });
            nightwatch.on('error', function(error){
              console.error('[StarryNight] ERROR spawning nightwatch. nightwatchCommand was', nightwatchCommand);
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
           //TODO: exit with error that will halt travis
           process.exit(1);
         }
      });



    break;

    //------------------------------------------------------------------------------------------
    case "tiny":
      console.log("Running tiny tests on packages.  Check http://localhost:3000");
      childProcess.exec("meteor test-packages", function(err, stdout, stderr) {
        console.log(stdout);
      });
    break;

    // //------------------------------------------------------------------------------------------
    // case "all":
    //   console.log("Running all tests...");
    //   childProcess.exec("ls -la", function(err, stdout, stderr) {
    //     console.log(stdout);
    //   });
    // break;

    //------------------------------------------------------------------------------------------
    default:
      console.log('No testing framework specified.  Please select:')
      console.log('> tiny');
      console.log('> end-to-end');
      console.log('> acceptance');
    break;
  }
}
