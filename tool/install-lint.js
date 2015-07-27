// child_process lets us exec and spawn external commands
var childProcess = require( 'child_process' );

// fs-extra lets us recursively copy directories and do advance file management
var fs = require( 'fs-extra' );

// npm install apm
// npm install -g eslint
// npm install -g eslint-plugin-react
// apm install linter
// apm install linter-eslint

module.exports = function () {
  console.log( 'Installing eslint...' );

};
