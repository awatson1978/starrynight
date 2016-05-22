// Write your package code here!
Meteor.startup(function (){
  ActiveLayout.configure({
    help: {
      link: "/menu",
      text: "",
      display: false
    },
    classes: {
      header: "",
      title: "",
      links: ""
    },
    text: {
      title: "Default Config",
      logout: "Logout"
    },
    fence: {
      north: 50,
      south: 0,
      east: 270,
      west: 270,
      maxPageWidth: 1024
    },
    defaults: {
      showNavbars: true,
      showSidebar: true,
      showSearchbar: false,
      useHierarchicalLayout: false,
      mainPanelIsCard: false,
      wideCard: true,
      useCardLayout: false,
      hasPagePadding: false,
      symmatricalPadding: false,
      hasPageVerticalPadding: false,
      useHorizontalFences: false,
      useVerticalFences: true,
      navIsFullscreen: true,
      fullscreenNavbars: true,
      fullscreen: true,
      secondPanelEnabled: false,
      appSurfaceOffset: false,
      useEastFence: false,
      pageWhite: true
    }
  });
});
