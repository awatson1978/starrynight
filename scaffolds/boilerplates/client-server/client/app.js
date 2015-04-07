Session.setDefault('receivedData', false);

Meteor.autorun(function(){
  Meteor.subscribe('customerAccounts');
});
