#! /usr/local/bin/node

// Include the system utility library (for output).
var util = require( "util" );

// Include the library for spinning up child processes. We'll need
// this to execute the "copy to clipboard" command.
var childProcess = require( "child_process" );


// We need some extra utilities to recursively copy directories
// so we can initialie framework default test files
var fs = require('fs-extra');

// we also want to check if config files exist
var fileExists = require('file-exists');

// ---------------------------------------------------------- //
// ---------------------------------------------------------- //

// lets start parsing our arguments
var primaryArgument = (process.argv[ 2 ] || "");
var secondaryArgument = (process.argv[ 3 ] || "");
var filterTag = null;

// Check to see if the use has supplied a filter.
switch (primaryArgument){

    case "":
        util.puts( "Welcome to StarrySky.  Use -help for more info." );
    break;


    //==============================================================================================
    case "-initialize":
      util.puts('StarrySky is initializing some default tests in your app...');

      switch (secondaryArgument) {
        case "nightwatch":
          fs.copy('/usr/local/lib/node_modules/starrysky/sample-tests/nightwatch', './tests/nightwatch', function (error) {
            if (error){
              return console.error(error)
            }
            console.log('Tests copied over!')
          });
          break;
        default:
          // we're going to copy over all of the contents in the sample-tests directory
          fs.copy('/usr/local/lib/node_modules/starrysky/sample-tests', './tests', function (error) {
            if (error){
              return console.error(error)
            }
            console.log('Tests copied over!')
          });
          break;
        break;
      }
    break;



    //==============================================================================================
    case "-run":
      util.puts('StarrySky is running tests...');

      switch (secondaryArgument) {

        //------------------------------------------------------------------------------------------
        case "":
          util.puts("Running all tests...");
          // childProcess.exec("ls -la", function(err, stdout, stderr) {
          //   console.log(stdout);
          // });

          //childProcess.spawn('nightwatch', ['-c', './assets/packages/clinical_nightwatch/nightwatch_from_velocity_console.json'], function(error, result){
          // childProcess.spawn('nightwatch', [], function(error, result){
          //   if(error){
          //     console.log("Couldn't find nightwatch ", error);
          //   }
          //   if(result){
          //     console.log(result);
          //   }
          // });
        break;

        //------------------------------------------------------------------------------------------
        case "end-to-end":
          util.puts("Running end-to-end tests...");
          childProcess.exec("pwd", function(err, stdout, stderr) {
            console.log(stdout);
          });
        break;

        //------------------------------------------------------------------------------------------
        case "acceptance":
          util.puts("Running acceptance tests.  This will take a few moments as we download things...");

          // is clinical:nightwatch even installed?
          if(!fileExists('.meteor/local/build/programs/server/assets/packages/clinical_nightwatch/selenium/selenium-server-standalone-2.44.0.jar')){
            console.log("Can't find selenium-server!  Try running 'meteor add clinical:nightwatch'");
          }else{
            console.log("Installing selenium server...");
            childProcess.exec("npm install selenium-server -g", function(error, result){
              if(result){

                console.log("Installing nightwatch...");
                childProcess.exec("npm install nightwatch@0.6.0 -g", function(error, result){
                  if(error){
                    console.log("[starrysky] ERROR in executing installation: ", error);
                  }

                  util.puts(result);



                  console.log("Installing nightwatch...");
                  var nightwatch = childProcess.spawn('nightwatch', ['-c', '/usr/local/lib/node_modules/starrysky/configs/nightwatch/config.json'], function(error, result){
                    if(error){
                      console.log("[starrysky] ERROR spawning nightwatch: ", error);
                    }
                    if(result){
                      console.log("result", result);
                    }
                  });


                  var frameworkExitCode = 0;
                  nightwatch.stdout.on('data', function(data){

                    // data is in hex, lets convert it
                    // it also has a line break at the end; lets get rid of that
                    console.log(("" + data).slice(0, -1));

                    // without this, travis CI won't report that there are failed tests
                    if(("" + data).indexOf("✖") > -1){
                      frameworkExitCode = 1;
                    }
                  });
                  nightwatch.on('close', function(nightwatchExitCode){
                    if(nightwatchExitCode === 0){
                      console.log('Finished!  Nightwatch ran all the tests!');
                        process.exit(nightwatchExitCode);
                    }
                    if(nightwatchExitCode !== 0){
                      console.log('Uh oh!  Something went awry.  Nightwatch exited with a code of ' + nightwatchExitCode);
                        process.exit(nightwatchExitCode);
                    }
                  });
                });
              }
            })
          }




        break;

        //------------------------------------------------------------------------------------------
        case "tiny":
          util.puts("Running unit tests on packages.  Check http://localhost:3000");
          childProcess.exec("meteor test-packages", function(err, stdout, stderr) {
            console.log(stdout);
          });
        break;

        //------------------------------------------------------------------------------------------
        case "all":
          util.puts("Running all tests...");
          childProcess.exec("ls -la", function(err, stdout, stderr) {
            console.log(stdout);
          });
        break;

        //------------------------------------------------------------------------------------------
        default:
          util.puts("Running all tests...");
          childProcess.exec("ls -la", function(err, stdout, stderr) {
            console.log(stdout);
          });
        break;
      }

    break;

    case "-help":
        util.puts( "StarrySky... The ultra-simple way to watch your Meteor apps for QA issues." );
        util.puts( "Useage:" );
        util.puts( "  -initialize" );
        util.puts( "  -run [tiny | unit | acceptance | end-to-end | all]" );
    break;

    // If we could not figure out what the command-line argument was,
    // then something is incorrect. Exit out.
    default:

        util.puts( "Didn't understand that command.  Try again?" );

        // Exit out of the process (as a failure).
        process.exit( 1 );

    break;

}
