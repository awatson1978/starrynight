Session.setDefault('fooSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);



//------------------------------------------------------------------------------
// ROUTING

Router.map(function(){
  this.route('foosListPage', {
    path: '/list/foos/',
    template: 'foosListPage'
  });
});


//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.foosListPage.events({
  'click li':function(){
    Router.go('/foo/' + this._id);
  },
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #fooSearchInput': function() {
    Session.set('fooSearchFilter', $('#fooSearchInput').val());
  }
});


//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS


var OFFSCREEN_CLASS = 'off-screen';
var EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

Template.foosListPage.rendered = function(){
  console.log("trying to update layout...");

  Template.appLayout.delayedLayout(20);


  /*//  this.firstNode.parentNode._uihooks = {
  this.find('#foosUnorderedList')._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .addClass(OFFSCREEN_CLASS)
        .insertBefore(next);

      Tracker.afterFlush(function() {
        // call width to force the browser to draw it
        $(node).width();
        $(node).removeClass(OFFSCREEN_CLASS);
      });
    },
      // we could do better I guess?
    moveElement: function(node, next) {
      //this.firstNode.parentNode._uihooks.removeElement(node);
      //this.firstNode.parentNode._uihooks.insertElement(node, next);

      $(node).animate({ height: 'toggle', opacity: 'toggle' }, 'slow').promise().done(function(){
      $(node).insertBefore(next).animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
    });
    },
    removeElement: function(node) {
      $(node).addClass(OFFSCREEN_CLASS)
        .on(EVENTS, function() {
          $(node).remove()
        });
    }
  }*/


};


Template.foosListPage.helpers({
  foosList: function() {
    // this triggers a refresh of data elsewhere in the table
    // step C:  receive some data and set our reactive data variable with a new value
    Session.set('receivedData', new Date());

    Template.appLayout.delayedLayout(20);


    // this is a performant local (client-side) search on the data
    // current in our CustomerAccounts cursor, and will reactively
    // update the table

    //console.log(Session.get('fooSearchFilter'));

    return Foo.find({
      title: {
        $regex: Session.get('fooSearchFilter'),
        $options: 'i'
    }});
  }
});
