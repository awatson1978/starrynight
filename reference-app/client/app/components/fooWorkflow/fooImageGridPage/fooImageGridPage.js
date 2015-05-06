Router.route("/protocols", {
  template: "fooImageGridPage",
  name: "fooImageGridPage"
});


Template.fooImageGridPage.helpers({
  lists: function() {
    return Foo.find();
  }
});

Template.fooImageGridPage.events({
  "click #event": function(event, template){

  }
});
