Router.route("/testing", {
  name:"testing",
  template:"testing"
});

Template.testing.helpers({ 
  rendered: function(){

  }
});

Template.testing.events({ 
  "click #elementId": function(event, template){

  }
});
