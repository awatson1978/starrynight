var fs = require('fs');
var fsextra = require('fs-extra');
var path = require('path');
var rimraf = require('rimraf');
var glob = require("glob");
var Cucumber = require('cucumber/lib/cucumber');
var CucumberSummaryFormatter = require('cucumber/lib/cucumber/listener/summary_formatter')({snippets: true});
//var tempTestFolder = path.resolve(process.cwd(), '../temp-tests');
var tempTestFolder = 'tests/nightwatch/temp-tests';
var runtime = Cucumber(getFeatureSources(), getSupportCodeInitializer());
var cucumber = {
  features: {}
};

rimraf.sync(tempTestFolder);
fs.mkdirSync(tempTestFolder);

var globals = require(process.cwd() + '/tests/nightwatch/globals.json');

function getFeatureSources() {
  var featureSources = [];

  glob.sync("tests/nightwatch/specifications/**/*.feature").forEach(function(file) {
    featureSources.push([path.resolve(process.cwd(), file), fs.readFileSync(file)]);
  });

  console.log("featureSources", featureSources);

  return featureSources;
}

function getSupportCodeInitializer() {
  return function() {
    var files = [],
    supportCodeHelper = this;
    console.log("supportCodeHelper", supportCodeHelper);

    glob.sync("tests/nightwatch/specifications/spec-definitions/**/*.js").forEach(function(file) {
      files.push(path.resolve(process.cwd(), file));
    });

    files.forEach(function(file) {
      var initializer = require(file);

      if (typeof(initializer) === 'function'){
        initializer.call(supportCodeHelper);
      }
    });
  };
}

function getStepExecutor(step) {
  var stepDefinition = runtime.getSupportCodeLibrary().lookupStepDefinitionByName(step.getName());
  //console.log("getSupportCodeLibrary", runtime.getSupportCodeLibrary());

  if (!stepDefinition) {
    CucumberSummaryFormatter.storeUndefinedStepResult(step);
    CucumberSummaryFormatter.log(Cucumber.Util.ConsoleColor.format('pending', 'Undefined steps found!\n'));
    return;
  }

  return function (context, callback) {
    stepDefinition.invoke(step, context, {getAttachments: function(){}}, {id:1}, callback);
  }
}

function discoverScenario(feature, scenario, steps) {
  //console.log("discoverScenario", feature, scenario, steps);

  if (!feature.discovered) {
    feature.discovered = {};
    cucumber.features[feature.getName()] = feature.discovered;
  }

  feature.discovered[scenario.getName()] = function(browser) {
    //console.log("browser", browser);
    steps.forEach(function(step) {
      //console.log("step", step);
      step(browser, function(result) {
        if (result.isFailed()) {
          console.log(result.getFailureException());
        }
      });
    });
    browser.end();
  };
}

function createTestFile(feature, options) {
  var testFileSource = 'module.exports = require(process.cwd() + "tests/nightwatch/globals.json").features["' + feature.getName() + '"];';
  var testFile = path.resolve(tempTestFolder, feature.getName().replace(/\W+/g, '') + '.js');
  //var testFile = tempTestFolder + "/" + feature.getName().replace(/\W+/g, '') + '.js';
  if(options.trace){
    console.log('createTestFile', testFile);
  }
  if(options.debug){
    console.log('testFileSource', testFileSource);
  }

  fsextra.outputFile(testFile, testFileSource, function(error, result){
    if(options.debug && error){
      console.log("createTestFile[error]", error);
    }
  });

  // fsextra.outputFileSync(testFile, testFileSource, function(error, result){
  //   if(options.debug && error){
  //     console.log("createTestFile[error]", error);
  //   }
  // });
}


//module.exports = cucumber;

module.exports = function(options){
  console.log("need to build up our globals.json file...");



  //runtime = Cucumber(getFeatureSources(), getSupportCodeInitializer());

  runtime.getFeatures().getFeatures().forEach(function(feature, next) {
    if(options.debug){
      console.log("feature", feature.getName());
    }
    createTestFile(feature, options);
    feature.instructVisitorToVisitScenarios({
      visitScenario: function(scenario) {
        var steps = [];
        console.log("visitScenario", scenario.getSteps());
        scenario.getSteps().forEach(function(step, next) {

          console.log(step.getName());

          var stepExecutor = getStepExecutor(step);

          if (stepExecutor) {
            steps.push(stepExecutor);
          }
          next();
        }, function() {
          discoverScenario(feature, scenario, steps);
        });
      }
    });
  }, function() {});

  if (CucumberSummaryFormatter.getUndefinedStepLogBuffer()) {
    CucumberSummaryFormatter.logUndefinedStepSnippets();
  }


  //fsextra.readJson('tests/nightwatch/globals.json', function(error, globalsObject){
    if(options.trace){
      console.log("cucumber", cucumber);
    }
    if(options.debug){
      //if(error){
      //  console.log("globalsObject[error]", error);
      //}

      globals.features = cucumber.features;

      console.log("globals", globals);
      //console.log("globalsObject", globalsObject);

      fsextra.writeJson('tests/nightwatch/globals.json', globals, {spaces: 2}, function (error, result) {
        if(error){
          console.log(error)
        }
        console.log("Writing tests/nightwatch/globals.json");

      });
    }
  ///});

}
