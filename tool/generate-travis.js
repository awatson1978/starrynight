
// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');

module.exports = function(npmPrefix){
  fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/continuous-integration/.travis.yml', './.travis.yml', function (error) {
    if (error){
      return console.error(error)
    }
    console.log('.travis.yml added to project.')
  });
}
