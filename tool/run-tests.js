
// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

// request allows us to query external websites
var request = require('request');

// for _.extend()ing the process.env object
var _ = require('underscore');

var runEndToEnd = require('./frameworks/end-to-end.js');
var runTinyTests = require('./frameworks/tinytest.js');
var runNightwatch = require('./frameworks/nightwatch.js');

var runSpaceJam = require('./frameworks/spacejam.js');
var runPioneer = require('./frameworks/pioneer.js');
var runJasmine = require('./frameworks/jasmine.js');
var runCucumber = require('./frameworks/cucumber.js');
var runMocha = require('./frameworks/mocha.js');

var runTinyTestsInServerConsole = require('./frameworks/tinytest-on-server-console.js');
var runMultiFramework = require('./frameworks/multi-framework.js');

module.exports = function(npmPrefix, testType, options){

  if(options.framework){
    switch (options.framework) {

      //------------------------------------------------------------------------------------------
      case "end-to-end":
        console.log("Running end-to-end tests (experimental)...");
        runEndToEnd();
      break;

      //------------------------------------------------------------------------------------------
      case "nightwatch":
        console.log("Launching StarryNight.  Analyzing meteor environment...");
        runNightwatch(npmPrefix, options);
      break;

      //------------------------------------------------------------------------------------------
      case "jasmine":
        console.log("Launching Jasmine.  Analyzing meteor environment...");
        runJasmine(npmPrefix);
      break;

      //------------------------------------------------------------------------------------------
      case "spacejam":
        console.log("Launching SpaceJam.  Analyzing meteor environment...");
        runSpaceJam();
      break;

      //------------------------------------------------------------------------------------------
      case "mocha":
        console.log("Launching Mocha.  Analyzing meteor environment...");
        runMocha(npmPrefix);
      break;

      //------------------------------------------------------------------------------------------
      case "pioneer":
        console.log("Launching Pioneer.  Analyzing meteor environment...");
        runPioneer(npmPrefix);
      break;

      //------------------------------------------------------------------------------------------
      case "tinytest":
        console.log("Running tiny tests on packages.  Check http://localhost:3000");
        runTinyTests();
      break;

      //------------------------------------------------------------------------------------------
      case "tinytest-ci":
        console.log("Running tiny tests on packages.  Check http://localhost:3000");
        runTinyTestsInServerConsole(npmPrefix);
      break;

      //------------------------------------------------------------------------------------------
      case "multi":
        console.log("Running all non-experimental test frameworks...");
        runMultiFramework(npmPrefix);
      break;

      //------------------------------------------------------------------------------------------
      default:
        console.log("Didn't recognize that framework.  Please select:");
        console.log('> tinytest');
        console.log('> tinytest-ci');
        console.log('> nightwatch');
        console.log("");
        console.log("Experimental support is available for:");
        console.log('> end-to-end');
        console.log('> spacejam');
        console.log('> mocha');
        console.log('> pioneer');
        console.log('> jasmine');
        console.log('> cucumber');
      break;
    }
  }

  if(options.type){
    switch (options.type) {

      //------------------------------------------------------------------------------------------
      case "oauth-end-to-end":
        console.log("Running oauth end-to-end tests...");
        runEndToEnd();
      break;

      //------------------------------------------------------------------------------------------
      case "end-to-end":
        console.log("Launching Nightwatch to run end-to-end tests.  Analyzing meteor environment...");
        runPioneer();
      break;

      //------------------------------------------------------------------------------------------
      case "tiny-tests":
        console.log("Launching TinyTest to unit-test packages.  Check http://localhost:3000");
        runTinyTests();
      break;

      //------------------------------------------------------------------------------------------
      case "package-tests":
        console.log("Launching TinyTest to unit-test packages.  Check http://localhost:3000");
        runTinyTestsInServerConsole(npmPrefix);
      break;

      //------------------------------------------------------------------------------------------
      case "package-unit":
        console.log("Launching SpaceJam to unit/integration test packages with chai.  Check http://localhost:3000");
        runSpaceJam();
      break;

      //------------------------------------------------------------------------------------------
      case "integration":
        console.log("Launching Mocha to run integration tests.  Check http://localhost:3000");
        runPioneer();
      break;

      //------------------------------------------------------------------------------------------
      case "acceptance":
        console.log("Launching Pioneer to run acceptance tests.  Check http://localhost:3000");
        runNightwatch(npmPrefix);
      break;

      //------------------------------------------------------------------------------------------
      case "validation":
        console.log("Launching Pioneer to run acceptance tests.  Check http://localhost:3000");
        runNightwatch(npmPrefix);
      break;

      //------------------------------------------------------------------------------------------
      case "all":
        console.log("Running all non-experimental test frameworks...");
        runNightwatch(npmPrefix);
        runTinyTestsInServerConsole(npmPrefix);
      break;

      //------------------------------------------------------------------------------------------
      default:
        console.log('No testing framework specified.  Please select:')
        console.log('> package-tests');
        console.log('> package-unit');
        console.log('> unit');
        console.log('> integration');
        console.log('> acceptance');
        console.log('> end-to-end');
        console.log('> oauth-end-to-end (experimental)');
      break;
    }
  }



}
