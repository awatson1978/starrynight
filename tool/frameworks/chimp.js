// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

module.exports = function(npmPrefix, options){
  /*childProcess.exec("spacejam test-packages", function(err, stdout, stderr) {
    console.log(stdout);
  });*/

  var testCommand = "chimp";
  // var mochaCommand = npmPrefix + '/lib/node_modules/starrynight/node_modules/mocha/bin/mocha';
  var spaceJamCommand = npmPrefix + '/lib/node_modules/chimp/bin/chimp';
  var spaceJamExitCode = 0;

  var spacejam = childProcess.spawn(spaceJamCommand, ['']);
  spacejam.stdout.on('data', function(data){
    console.log(data.toString().trim());

    // without this, travis CI won't report that there are failed tests
    if(data.toString().indexOf("FAILED") > -1){
      spaceJamExitCode = 1;
    }
  });
  spacejam.stderr.on('data', function(data) {
    console.error(data.toString());
  });
  spacejam.on('error', function(error){
    console.error('[StarryNight] ERROR spawning spacejam.');
    throw error;
  });
  spacejam.on('close', function(spaceJamExitCode){
    if(spaceJamExitCode === 0){
      console.log('Finished!  SpaceJam ran all the tests!');
        process.exit(spaceJamExitCode);
    }
    if(spaceJamExitCode !== 0){
      console.log('SpaceJam exited with a code of ' + spaceJamExitCode);
      process.exit(spaceJamExitCode);
    }
  });
}
