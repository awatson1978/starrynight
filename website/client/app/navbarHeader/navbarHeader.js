

Template.navbarHeader.events({
  "click #architectureLink": function (event, template) {
    Router.go('/architecture');
  },
  "click #guideLink": function (event, template) {
    Router.go('/testing');
  },
  "click #scaffoldingLink": function (event, template) {
    Router.go('/scaffolding');
  },
  "click #examplesLink": function (event, template) {
    Router.go('/examples');
  },
  "click #apiLink": function (event, template) {
    Router.go('http://clinical-docs.meteor.com');
  },
  "click #faqLink": function (event, template) {
    Router.go('/faq');
  },
  "click #aboutLink": function (event, template) {
    Router.go('/about');
  }
});
