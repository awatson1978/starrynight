Router.route("/examples", {
  name:"examples",
  template:"examples"
});

Template.examples.helpers({ 
  rendered: function(){

  }
});

Template.examples.events({ 
  "click #elementId": function(event, template){

  }
});
