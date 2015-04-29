
Router.map(function(){
  this.route('newFooRoute', {
    path: '/newcustomer',
    template: 'customerUpsertPage'
  });
  this.route('editFooRoute', {
    path: '/editcustomer/:id',
    template: 'customerUpsertPage',
    data: function(){
      return Foo.findOne(this.params.id);
    }
  });
});

//-------------------------------------------------------------


Template.customerUpsertPage.events({
  'keyup #firstNameInput':function(){
    Foo.update({_id: this._id}, {
      $set: {
        'FullName': $('#firstNameInput').val()
      }
    });
  },
  'keyup #emailInput':function(){
    Foo.update({_id: this._id}, {
      $set: {
        'Email': $('#emailInput').val()
      }
    });
  },
  'keyup #webInput':function(){
    Foo.update({_id: this._id}, {
      $set: {
        'Web': $('#webInput').val()
      }
    });
  },
  'click #previewFooButton':function(){
    Router.go('/customer/' + this._id);
  }
});



//-------------------------------------------------------------

Template.customerUpsertPage.helpers({
  getRecordId: function() {
    if(this._id) {
      return this._id;
    }else{
      return "---";
    }
  }
});

Template.customerUpsertPage.events({
  'click #upsertFooButton': function() {
    console.log('creating new user...');

      // TODO:  add validation functions

      var customerObject = {
        FullName: $('#firstNameInput').val(),
        Web: $('#webInput').val(),
        Notes: $('#notesInput').val()
      };

      if(this._id){
        console.log('upserting ' + this._id);
        var self = this;
        customerObject._id = this._id;
        Meteor.call('updateFoo', customerObject, function(error, customer){
          console.log('error: ' + error);
          if(customer){
            console.log('customer: ' + customer);
            Router.go('/customer/' + self._id);
          }
        });
      }else{
        Meteor.call('createNewFoo', customerObject, function(error, customer) {
          console.log('error: ' + error);
          console.log('customer: ' + customer);
          Router.go('/customer/' + customer);
        });
      }

  },
  'click #deleteUserButton': function() {
    Foo.remove(Session.get('selected_user'));
  },
  'click #cancelDeleteButton': function() {
    Router.go('/customers');
  }
});
