StarryNight
=======================

A node executable for launching nightwatch from Meteor atmosphere packages.  

===============================
#### What is StarryNight?  

StarryNight is a command line tool for use in scaffolding and testing Meteor applications. It's similar to tools like 'rails generate', 'spacejam', 'abee', and 'mrt'. It's a direct result of 2 years of working on the Meteor Cookbook.

===============================
#### Why StarryNight?  

- lean, simple, and focused  
- doesn't have the bloat of mirrors, file monitors, html reporters, and the like  
- not focused on reactive user interfaces  
- has best-practice scaffolding for getting people started  
- embraces the existing testing tools used by MDG  
- assumes developers will be using 3rd party SaaS solutions  
- isn't trying to be a SaaS platform  
- single tool, not a collection of a dozen packages  
- easy to integrate new testing frameworks  
- easy to integrate new code snippets and boilerplates  

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
-run-tests [tiny | unit | acceptance | all]
````

===============================
#### Examples  

````sh
# add acceptance tests to your application (using the nightwatch framework)
$ starrysky -initialize acceptance

# run acceptance tests
$ starrysky -run acceptance
````

===============================
#### Contributing  

StarryNight needs a few basic things to integrate new frameworks.

1.  We need to know how to install the framework.
2.  We need to know how to launch the framework.
3.  We need a set of sample tests to get people started.
4.  We need to configure the framework to use the sample tests.

This is significantly more lightweight than what's required to integrate frameworks with Velocity.  If you can do the above and submit a pull request, it will probably get into StarryNight.  


===============================
#### Licensing

MIT License. Use as you wish, including for commercial purposes.
