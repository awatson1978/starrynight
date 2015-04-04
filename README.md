starrysky
=======================

A node executable for launching nightwatch from Meteor atmosphere packages.  

===============================
#### Why StarrySky?  

StarrySky is actually a spinoff/fork of the Velocity project, with something like 90% of it ripped out.  Long story short, there were some disagreements about architecture, community needs, what should be in the velocity repositories, etc. and this is a different architectural vision of how to bring multiple testing frameworks together.

- Compared to Velocity, StarrySky is lean, simple, and focused, and doesn't have the bloat of mirrors, file monitors, and the like.  

- StarrySky takes the assumption that developers will be using 3rd party SaaS solutions for those needs (GitHub, Travis, BrowserStack, etc) whereas Velocity is trying to be itself a SaaS testing solution.  

- Velocity is very much trying to bring best practices from the broader testing world to Meteor; whereas StarrySky is trying to embrace the existing testing tools (TinyTest, and by extention mUnit) and get Selnium into the mix as simply as possible, so people can get their apps onto 3rd party SaaS platforms as quickly as possible.  


===============================
#### Installation  

````
npm install starrysky -g
```

===============================
#### Usage  

````
-help
-initialize [acceptance | all]
-run [tiny | unit | acceptance | all]
````


===============================
#### Contributing  

StarrySky needs a few basic things to integrate new frameworks.

1.  We need to know how to install the framework.
2.  We need to know how to launch the framework.
3.  We need a set of sample tests to get people started.
4.  We need to configure the framework to use the sample tests.

This is significantly more lightweight than what's required to integrate frameworks with Velocity.  If you can do the above and submit a pull request, it will probably get into StarrySky.  


===============================
#### Licensing

MIT License. Use as you wish, including for commercial purposes.
