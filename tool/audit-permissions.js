// https://docs.npmjs.com/getting-started/fixing-npm-permissions
// http://stackoverflow.com/questions/17990647/npm-install-errors-with-error-enoent-chmod
//


// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

module.exports = function(options, npmPrefix){
  console.log("Fixing permissions in .meteor directory.");
  childProcess.exec("chmod -R 755 .meteor", function(err, stdout, stderr) {
    console.log(stdout);
  });
  childProcess.exec("chmod -R 755 .", function(err, stdout, stderr) {
    console.log(stdout);
  });

  if(options.npm){
    childProcess.exec("npm cache clean", function(err, stdout, stderr) {
      console.log(stdout);
    });

    childProcess.exec("chmod -R 755 " + npmPrefix + "/lib/node_modules", function(err, stdout, stderr) {
      console.log(stdout);
    });
    childProcess.exec("chmod -R 755 " + npmPrefix + "/bin", function(err, stdout, stderr) {
      console.log(stdout);
    });
    childProcess.exec("chmod -R 755 " + npmPrefix + "/share", function(err, stdout, stderr) {
      console.log(stdout);
    });
  }

}
