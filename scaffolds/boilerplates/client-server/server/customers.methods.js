Meteor.methods({
  createNewCustomer: function(data){
    console.log('createNewCustomer', data);

    data.createdAt = new Date();
    return CustomerAccounts.insert(data);
  },
  updateCustomer: function(data){
    console.log('updateCustomer', data);

    data.createdAt = new Date();
    return CustomerAccounts.update({_id: data._id}, {$set:{
      FirstName: data.FirstName,
      LastName: data.LastName,
      FullName: data.FirstName + " " + data.LastName,
      Company: data.Company,
      Address: data.Address,
      City: data.City,
      County: data.County,
      State: data.State,
      Zip: data.Zip,
      Phone: data.Phone,
      Fax: data.Fax,
      Email: data.Email,
      Web: data.Web,
      Notes: data.Notes
    }});
  }
});
