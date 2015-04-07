Meteor.publish('customerAccounts', function () {
  return CustomerAccounts.find();
});
