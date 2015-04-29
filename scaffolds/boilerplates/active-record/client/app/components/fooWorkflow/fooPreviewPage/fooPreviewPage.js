
Router.map(function(){
  this.route('fooPreviewPage', {
    path: '/foo/:id',
    template: 'fooPreviewPage',
    data: function () {
      return CustomerAccounts.findOne({_id: this.params.id});
    }
  });
});


Template.fooPreviewPage.events({
  'click #fooEditButton':function(){
    Router.go('/editfoo/' + this._id);
  },
  'click #fooDeleteButton':function(){
    if(confirm('Are you sure you want to delete ' + this.FirstName + " " + this.LastName + "?")){
      CustomerAccounts.remove({_id: this._id});
      Router.go('/');
    }
  }
});
