#! /usr/bin/env node

//"server_path" : ".meteor/local/build/programs/server/assets/packages/clinical_nightwatch/selenium/selenium-server-standalone-2.44.0.jar",

// This tool is basically about copying files to places they need to be and launching other utilities.


var DEBUG = false;

if(process.env.DEBUG){
  DEBUG = true;
}


//==================================================================================================
// REQUIRED IMPORTS


// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

// github-download allows us to clone repos into our application
var githubDownload = require('github-download');

// minimist lets us cleanly parse our cli arguments into an object
var minimist  = require('minimist');
//var arguments = require('minimist')(process.argv.slice(2));

// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');

// file-exists allows us to make sure config files exist
var fileExists = require('file-exists');

// http allows us to detect if instances of meteor are running in expected locations
var http = require('http');

// request allows us to query external websites
var request = require('request');

// replace allows us to refactor contents of file
var replace = require('replace');

// just want to know where it's located
/*var seleniumJar = require('selenium-server-standalone-jar');*/

// so we can find the NODE_PATH
var path = require('path');

// fibers and futures allow us to make remote async calls
var Fiber = require('fibers');
var Future = require('fibers/future');

// so we can get the npm install prefix
var npm = require('npm');

// for _.extend()ing the process.env object
var _ = require('underscore');

// so we can read files from the filesystem
var filesystem = require('fs');

// cheerio provides DOM/jQuery utilities to lets us parse html
var cheerio = require('cheerio');

// unzip lets us uncompress files
var unzip = require('unzip');

// prompt lets us accept input from the keyboard
// https://www.npmjs.com/package/prompt
var prompt = require('prompt');



//==================================================================================================
// FILE LINKING

var help = require('../tool/help.js');
var auditPermissions = require('../tool/audit-permissions.js');
var clone = require('../tool/clone.js');
var displayEnv = require('../tool/display-env.js');
var extractClasses = require('../tool/extract-classes.js');
var extractIds = require('../tool/extract-ids.js');
var extractTestsFor = require('../tool/extract-tests-for.js');
var findAndReplace = require('../tool/find-and-replace.js');
var generateTravis = require('../tool/generate-travis.js');
var pattern = require('../tool/pattern.js');
var refactor = require('../tool/refactor.js');
var rename = require('../tool/rename.js');
var sample = require('../tool/sample.js');
var scaffold = require('../tool/scaffold.js');
var generateReleaseJson = require('../tool/generate-release-json.js');
var extractTools = require('../tool/extract-tools.js');
var downloadTools = require('../tool/download-tools.js');

var createPackage = require('../tool/create.js');
var publishPackage = require('../tool/publish.js');

// deprecated APIs
var runFramework = require('../tool/run-framework.js');
var runTests = require('../tool/run-tests.js');

//==================================================================================================
// DEBUGGING

if(process.env.DEBUG){
  console.dir(process.argv);
  console.log("arg0: ", process.argv[0]);
  console.log("arg1: ", process.argv[1]);
  console.log("arg2: ", process.argv[2]);
  console.log("arg3: ", process.argv[3]);

  console.log('STARRYNIGHT_FRAMEWORK:         ' + process.env.STARRYNIGHT_FRAMEWORK);
  console.log('STARRYNIGHT_FRAMEWORK_CONFIG:  ' + process.env.STARRYNIGHT_FRAMEWORK_CONFIG);
}




//****************************************************************************************************************
// VARIABLES

var isReadyToRun = true;


//****************************************************************************************************************
// PROCESSING COMMAND LINE ARGUMENTS

// most of StarySky uses a two argument syntax
var firstArgument = (process.argv[ 2 ] || "");
var secondArgument = (process.argv[ 3 ] || "");
var thirdArgument = (process.argv[ 4 ] || "");
var fourthArgument = (process.argv[ 5 ] || "");
var fifthArgument = (process.argv[ 5 ] || "");

// otherwise we'll want to pass in all of the arguments
var options = minimist(process.argv);

DEBUG && console.log(options);


npm.load(function(error, npm) {
  if (error) {
    throw error;
  }
  var npmPrefix = npm.config.get('prefix');

  DEBUG && console.log('npm prefix is', npmPrefix);

  // Check to see if the use has supplied a filter.
  switch (firstArgument){

      //============================================================================================================
      case "":
          console.log("");
          console.log( "Welcome to the StarryNight." );
          console.log( "Use --help for more info." );
      break;


      //============================================================================================================
      case "scaffold":
        scaffold(npmPrefix, process.argv, options)
      break;


      //============================================================================================================
      case "sample":
        console.log('StarryNight is initializing some default tests in your app...');
        sample(npmPrefix, secondArgument, thirdArgument);
      break;


      //============================================================================================================
      // -initialize is simply an alias for -sample

      case "initialize":
        console.log('StarryNight is initializing some default tests in your app...');
        sample(npmPrefix, secondArgument, thirdArgument);
      break;


      //==============================================================================================
      case "run-tests":
        runTests(npmPrefix, secondArgument, options);
      break;


      //==============================================================================================
      case "survey":
        runTests(npmPrefix, secondArgument);
      break;


      //==============================================================================================
      case "run-framework":
        runFramework(npmPrefix, secondArgument, options);
      break;


      //==============================================================================================
      /*case "nightwatch":
        runTests(npmPrefix, secondArgument);
      break;*/


      //==================================================================================================
      case "create":
      // starrynight create --package foo:mypackage --from /path/to/component
        createPackage(options);
      break;

      //==================================================================================================
      // starrynight publish --bulk
      case "publish":
        publishPackage(npmPrefix, process.argv, options);
      break;

      //==================================================================================================
      // starrynight clone http://www.github.com/myaccount/myrepo
      // TODO: starrynight clone --url starrynight clone http://www.github.com/myaccount/myrepo

      case "clone":
        clone(secondArgument);
        auditPermissions();
      break;


      //==================================================================================================
      // -pattern is similar to -clone, but assumes that the target url implements a standard boilerplate
      // it then goes into the boilerplate, and copies files into appropriate locations
      // and avoids copying over package and repo specific files
      // in other words, it's a 'smart clone'

      case "pattern":
        pattern(options);
      break;


      //==================================================================================================
      case "rename":
        // starrynight refactor Page Panel app/components
        // starrynight refactor originalTerm newTerm directoryRoot
        // starrynight refactor secondArgument thirdArgument fourthArgument
        // TODO: starrynight refactor --old secondArgument --new thirdArgument --dir /path/to/component

        auditPermissions();
        rename(options);
      break;


      //==================================================================================================
      case "find-and-replace":
        // starrynight find-and-replace foo bar app/components
        // TODO: starrynight find-and-replace --current currentTerm --new newTerm --dir /path/to/component

        auditPermissions();
        findAndReplace(options);
      break;


      //==================================================================================================
      case "refactor":
        // starrynight -refactor foo bar app/components
        // starrynight -refactor originalTerm newTerm directoryRoot
        // starrynight -refactor secondArgument thirdArgument fourthArgument

        auditPermissions();
        refactor(secondArgument, thirdArgument, fourthArgument);
      break;


      //==================================================================================================
      case "audit-permissions":
        auditPermissions();
      break;


      //==================================================================================================
      case "--help":
        help();
      break;


      //==================================================================================================
      case "display-env":
        displayEnv();
      break;


      //==================================================================================================
      case "download-tools":
        downloadTools();
      break;


      //==================================================================================================
      case "extract-tools":
        extractTools();
      break;


      //==================================================================================================
      case "extract-ids":
        extractIds(secondArgument);
      break;


      //==================================================================================================
      case "extract-classes":
        extractClasses(secondArgument);
      break;


      //==================================================================================================
      case "extract-tests-for":
        extractTestsFor(secondArgument);
      break;


      //==================================================================================================
      case "generate-travis":
        //auditPermissions();
        generateTravis(npmPrefix);
      break;


      //==================================================================================================
      case "generate-release-json":
        generateReleaseJson();
      break;


      //==================================================================================================
      // If we can't figure out what the command-line argument was, then something is incorrect. Exit out.
      default:
          console.log( "Didn't understand that command.  Use --help for information." );

          // Exit out of the process (as a failure).
          process.exit( 1 );
      break;

  }
});
