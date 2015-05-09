
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

module.exports = function(npmPrefix, testType){
  switch (testType) {

    //------------------------------------------------------------------------------------------
    case "oauth-end-to-end":
      console.log("Running oauth end-to-end tests...");
      runEndToEnd();
    break;

    //------------------------------------------------------------------------------------------
    case "end-to-end":
      console.log("Launching Nightwatch to run end-to-end tests.  Analyzing meteor environment...");
      runNightwatch();
    break;

    //------------------------------------------------------------------------------------------
    case "package-tests":
      console.log("Launching TinyTest to unit-test packages.  Check http://localhost:3000");
      runTinyTests();
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
      runPioneer();
    break;

    //------------------------------------------------------------------------------------------
    case "all":
      console.log("Running all non-experimental test frameworks...");
      runNightwatch();
      runTinyTests();
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
