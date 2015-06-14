// replace allows us to refactor contents of file
var replace = require('replace');

module.exports = function(options){
  if(!options.root){
    options.root = ".";
  }

  if(options){
    if(options.from && options.to){
        replace({
          regex: options.from,
          replacement: options.to,
          paths: [
            options.root + "/client",
            options.root + "/server",
            options.root + "/lib",
            options.root + "/public",
            options.root + "/tests"
            ],
          excludes: [".meteor", ".git", ".meteor/*", ".git/*"],
          recursive: true
        });

        console.log('Done refactoring!');
    }
  }
}
