StarryNight

Scaffolding and testing tool for creating HIPAA and FDA compliant Meteor apps.  

===============================
#### What is StarryNight?  

StarryNight is a command line tool for use in scaffolding and testing Meteor applications. It's similar to tools like 'rails generate', 'spacejam', 'abee', and 'mrt'. It's a direct result of 2 years of working on the Meteor Cookbook.


===============================
#### Installation  

````
npm install starrynight -g
````

===============================
#### Usage  

````
-help
-scaffold [project-homepage | mobile-app | backend]
-clone [url]
-pattern [url]
-rename [originalTerm newTerm directoryRoot]
-refactor [originalTerm newTerm directoryRoot]
-dryrun [acceptance | all]
-run-tests [tiny | acceptance | end-to-end]
````

===============================
#### Examples  

````sh
# add acceptance tests to your application (using the nightwatch framework)
$ starrynight -initialize acceptance

# run acceptance tests
$ starrynight -run acceptance
````


===============================
#### Contributing a Test Framework

StarryNight needs a few basic things to integrate new frameworks.

1.  We need to know how to install the framework.
2.  We need to know how to launch the framework.
3.  We need a set of sample tests to get people started.
4.  We need to configure the framework to use the sample tests.

This is significantly more lightweight than what's required to integrate frameworks with Velocity.  If you can do the above and submit a pull request, it will probably get into StarryNight.  


===============================
#### Licensing

MIT License. Use as you wish, including for commercial purposes.
