



Template.testingSidebar.helpers({
  getLeft: function () {
    return "left: " + Session.get('sidebarLeft') + "px;";
  },
  isVisible: function(){
    /*if(Session.equals("sidebarVisible", true)){
      return "visible"
    }else{
      return "hidden";
    }*/
  }
});

Template.testingSidebar.events({
  "click #elementId": function(event, template){

  }
});
