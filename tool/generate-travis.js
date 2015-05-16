
// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');


// TODO:  detect that this is running in the app root
// ie. next to a .meteor directory
module.exports = function(npmPrefix){
  fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/continuous-integration/.travis.yml', './.travis.yml', function (error) {
    if (error){
      return console.error(error)
    }
    console.log('.travis.yml added to project.')
  });
}
