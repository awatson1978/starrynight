#! /usr/local/bin/node

//"server_path" : ".meteor/local/build/programs/server/assets/packages/clinical_nightwatch/selenium/selenium-server-standalone-2.44.0.jar",

// This tool is basically about copying files to places they need to be and launching other utilities.

//==================================================================================================
// REQUIRED IMPORTS

// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

// minimist lets us cleanly parse our cli arguments into an object
var minimist = require('minimist');

// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');

// file-exists allows us to make sure config files exist
var fileExists = require('file-exists');

// http allows us to detect if instances of meteor are running in expected locations
var http = require('http');

// github-download allows us to clone repos into our application
var githubDownload = require('github-download');

// node-parse-url breaks up a url into component parts for us
var urlParser = require('node-parse-url');

// request allows us to query external websites
var request = require('request');

// fibers and futures allow us to make remote async calls
var Fiber = require('fibers');
var Future = require('fibers/future');

//==================================================================================================
// VARIABLES

var isReadyToRun = true;


//==================================================================================================
// PROCESSING COMMAND LINE ARGUMENTS

// most of StarySky uses a two argument syntax
var primaryArgument = (process.argv[ 2 ] || "");
var secondaryArgument = (process.argv[ 3 ] || "");

// otherwise we'll want to pass in all of the arguments
var options = minimist(process.argv.slice(2));
console.log(options);
// var extendedArguments = process.argv.splice(0,2);
// console.log('Extended Arguments are: ', extendedArguments);


// Check to see if the use has supplied a filter.
switch (primaryArgument){

    //==============================================================================================
    case "":
        console.log( "Welcome to StarryNight.  Use -help for more info." );
    break;


    //==============================================================================================
    case "-initialize":
      console.log('StarryNight is initializing some default tests in your app...');

      switch (secondaryArgument) {
        case "nightwatch":
          fs.copy('/usr/local/lib/node_modules/starrynight/sample-tests/nightwatch', './tests/nightwatch', function (error) {
            if (error){
              return console.error(error)
            }
            console.log('Tests copied over!')
          });
          break;
        default:
          // we're going to copy over all of the contents in the sample-tests directory
          fs.copy('/usr/local/lib/node_modules/starrynight/sample-tests', './tests', function (error) {
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
      switch (secondaryArgument) {

        //------------------------------------------------------------------------------------------
        case "":
          console.log("Please specify a test type.");
        break;

        //------------------------------------------------------------------------------------------
        case "end-to-end":
          console.log("Running end-to-end tests...");
          childProcess.exec("selenium", function(err, stdout, stderr) {
            console.log(stdout);

            childProcess.exec("meteor-e2e --local --browsers=firefox", function(err, stdout, stderr) {
              console.log(stdout);
            });

          });
        break;

        //------------------------------------------------------------------------------------------
        case "acceptance":
          console.log("Running acceptance tests.  This will take a few moments as we download things...");

          if(!fileExists('.meteor/local/build/programs/server/assets/packages/clinical_nightwatch/selenium/selenium-server-standalone-2.44.0.jar')){
            console.log("Can't find selenium-server!  Try running 'meteor add clinical:nightwatch'");
            isReadyToRun = false;
          }else{
            console.log("Detected a selenium binary...");
          }

          request("http://localhost:3000", function (error, httpResponse) {
             if (httpResponse) {
               console.log("Detected a meteor instance...");
              //console.log("Installing selenium server...");
              //childProcess.exec("npm install selenium-server -g", function(error, result){
                //if(result){

                  console.log("Installing nightwatch...");
                  childProcess.exec("npm install nightwatch@0.6.0 -g", function(error, result){
                    if(error){
                      console.log("[StarryNight] ERROR in executing installation: ", error);
                    }

                    console.log(result);



                    console.log("Launching nightwatch bridge...");
                    var nightwatch = childProcess.spawn('nightwatch', ['-c', '/usr/local/lib/node_modules/starrynight/configs/nightwatch/config.json'], function(error, result){
                      if(error){
                        console.log("[StarryNight] ERROR spawning nightwatch: ", error);
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
                        console.log('Nightwatch exited with a code of ' + nightwatchExitCode);
                        process.exit(nightwatchExitCode);
                      }
                    });
                  });
                //}
              //});
             }
             if(error){
               console.log("No app is running on http://localhost:3000.  Try launching an app with 'meteor run'.");
             }
          });



        break;

        //------------------------------------------------------------------------------------------
        case "tiny":
          console.log("Running unit tests on packages.  Check http://localhost:3000");
          childProcess.exec("meteor test-packages", function(err, stdout, stderr) {
            console.log(stdout);
          });
        break;

        //------------------------------------------------------------------------------------------
        case "all":
          console.log("Running all tests...");
          childProcess.exec("ls -la", function(err, stdout, stderr) {
            console.log(stdout);
          });
        break;

        //------------------------------------------------------------------------------------------
        default:
          console.log("Running all tests...");
          childProcess.exec("ls -la", function(err, stdout, stderr) {
            console.log(stdout);
          });
        break;
      }

    break;



    //==================================================================================================
    case "-clone":
          console.log("Running all tests...");


          var url = urlParser(secondaryArgument);
          console.log('url', url);
          console.log('url.path', url.path);

          githubDownload({user: 'awatson1978', repo: 'clinical-checklists', ref: 'master'}, process.cwd())
            .on('dir', function(dir) {
              console.log(dir)
            })
            .on('file', function(file) {
              console.log(file)
            })
            .on('zip', function(zipUrl) { //only emitted if Github API limit is reached and the zip file is downloaded
              console.log(zipUrl)
            })
            .on('error', function(err) {
              console.error(err)
            })
            .on('end', function() {
              exec('tree', function(err, stdout, sderr) {
                console.log(stdout)
              })
            });
    break;


    //==================================================================================================
    case "-help":
        console.log( "StarryNight... The ultra-simple way to watch your Meteor apps for QA issues." );
        console.log( "Useage:" );
        console.log( "  -initialize" );
        console.log( "  -run [tiny | unit | acceptance | end-to-end | all]" );
        //console.log( "  -clone [url]" );
    break;


    //==================================================================================================
    // If we can't figure out what the command-line argument was, then something is incorrect. Exit out.
    default:

        console.log( "Didn't understand that command.  Try again?" );

        // Exit out of the process (as a failure).
        process.exit( 1 );

    break;

}
