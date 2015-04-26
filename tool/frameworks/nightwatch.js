module.exports = function(){
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
}
