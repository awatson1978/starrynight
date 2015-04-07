CustomerAccounts =  new Meteor.Collection("customerAccounts");
CustomerAccounts.allow({
  insert: function(){
    return true;
  },
  update: function () {
    return true;
  },
  remove: function(){
    return true;
  }
});


CustomerAccounts.attachSchema(Schemas.Customer);
