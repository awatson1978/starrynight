Session.setDefault('accountSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);



//------------------------------------------------------------------------------
// ROUTING

Router.map(function(){
  this.route('customersListPage', {
    path: '/customers',
    template: 'customersListPage'
  });
});


//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.customersListPage.events({
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #customersSearchInput': function() {
    Session.set('accountSearchFilter', $('#customersSearchInput').val());
  },
  // we set the same session variable from multiple buttons
  'click #twentyButton': function() {
    Session.set('tableLimit', 20);
  },
  'click #fiftyButton': function() {
    Session.set('tableLimit', 50);
  },
  'click #hundredButton': function() {
    Session.set('tableLimit', 100);
  },
  // this.index refers to a data context defined by
  // Template.customersListPage.paginationButtonList()
  'click .pagination-btn': function() {
    Session.set('selectedPagination', this.index);
    Session.set('skipCount', this.index * Session.get('tableLimit'));
  }
});


//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS

Template.customersListPage.helpers({
  customersList: function() {
    // this triggers a refresh of data elsewhere in the table
    // step C:  receive some data and set our reactive data variable with a new value
    Session.set('receivedData', new Date());

    // figure out our pagination count
    Session.set('paginationCount', Math.floor(CustomerAccounts.find().count() / Session.get('tableLimit')));

    // this is a performant local (client-side) search on the data
    // current in our CustomerAccounts cursor, and will reactively
    // update the table
    return CustomerAccounts.find({
      $or: [{
        FirstName: {
          $regex: Session.get('accountSearchFilter'),
          $options: 'i'
        }
      }, {
        LastName: {
          $regex: Session.get('accountSearchFilter'),
          $options: 'i'
        }
      }, {
        Company: {
          $regex: Session.get('accountSearchFilter'),
          $options: 'i'
        }
      }, {
        Zip: {
          $regex: Session.get('accountSearchFilter'),
          $options: 'i'
        }
      }, {
        Email: {
          $regex: Session.get('accountSearchFilter'),
          $options: 'i'
        }
      }]
    }, {
      limit: Session.get('tableLimit'),
      skip: Session.get('skipCount')
    });
  },
  rendered: function() {
    // step A:  initialize the table sorting functionality
    $(this.find('#customersTable')).tablesorter();

    // the Tracker API watches Collection and Session objects
    // so what we're doing here is registering a Tracker to watch the
    // Session.get('receivedData') variable.  When it changes, everything
    // in the autorun() clause will get rerun

    // step B:  register a tracker to add the tablesorting functionality back
    // after we update data
    Tracker.autorun(function() {

      // step D: register that the recevedData variable has been changed
      // and rerun the Tracker clause
      // step E: actually log the new value in receivedData
      console.log(Session.get('receivedData'))
      setTimeout(function() {
        // step F:  update the tablesorting library 200ms after receiving data
        // and Blaze has had a change to rerender the table
        $("#customersTable").trigger("update");
      }, 200);
    });
  },
  getPaginationCount: function() {
    return Session.get('paginationCount');
  },
  paginationButtonList: function() {
    // we're just creating an array of numbers the length of the paginationCount
    // [0,1,2,3,4,5]
    var paginationArray = [];
    for (var i = 0; i < Session.get('paginationCount'); i++) {
      paginationArray[i] = {
        index: i
      };
    };
    return paginationArray;
  },
  // helper functions to style buttons correctaly as a person clicks through the UI
  isTwentyActive: function() {
    if (Session.get('tableLimit') === 20) {
      return "active";
    }
  },
  isFiftyActive: function() {
    if (Session.get('tableLimit') === 50) {
      return "active";
    }
  },
  isHundredActive: function() {
    if (Session.get('tableLimit') === 100) {
      return "active";
    }
  }
});


Template.paginationButton.helpers({
  // helper functions to style buttons correctaly as a person clicks through the UI
  pageActive: function() {
    if (this.index === Session.get('selectedPagination')) {
      return "active";
    }
  },
  getPage: function() {
    return this.index + 1;
  }
});
