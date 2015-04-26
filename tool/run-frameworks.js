
// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

// request allows us to query external websites
var request = require('request');

// for _.extend()ing the process.env object
var _ = require('underscore');


var endToEnd = require('frameworks/end-to-end.js');



module.exports = function(npmPrefix, testType){
  switch (testType) {


    //------------------------------------------------------------------------------------------
    case "end-to-end":
      console.log("Running end-to-end tests...");
      endToEnd();
    break;

    //------------------------------------------------------------------------------------------
    case "acceptance":
      console.log("Launching StarryNight.  Analyzing meteor environment...");





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
