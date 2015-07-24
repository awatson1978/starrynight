

Router.route("/examples/refactor-a-package", {
  name:"packageRefactor",
  template:"packageRefactor",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.packageRefactor.helpers({

});

Template.packageRefactor.events({

});


Template.packageRefactor.onRender(function(){
  /* * * CONFIGURATION VARIABLES * * */
   var disqus_shortname = 'starrynight-utility';

   /* * * DON'T EDIT BELOW THIS LINE * * */
   (function() {
       var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
       dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
       (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
   })();
});
