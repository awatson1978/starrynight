
Router.route("/tutorials", {
  name:"tutorials",
  template:"tutorials"
});

Template.tutorials.helpers({ 
  rendered: function(){

  }
});

Template.tutorials.events({ 
  "click #elementId": function(event, template){

  }
});
