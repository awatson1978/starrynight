
Router.map(function(){
  this.route('fooPreviewPage', {
    path: '/foo/:id',
    template: 'fooPreviewPage',
    data: function () {
      return Foo.findOne({_id: this.params.id});
    },
    onAfterAction: function(){
      Template.appLayout.layout();
    }
  });
});


Template.fooPreviewPage.rendered = function(){
  Template.appLayout.layout();
};



Template.fooPreviewPage.events({
  "click .recordId": function(){
    Router.go('/edit/foo/' + this._id);
  },
  "click .indexButton": function(event, template){
    Router.go('/list/foos');
  }
});
