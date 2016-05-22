Meteor.startup(function (){
  Theme.configure({
    background: {
      color: "gradient"
    },
    page: {
      background: "#ffffff"
    },
    palette: {
      colorA: "#01b9af",
      colorB: "#00938b",
      colorC: "#f3f3f3",
      colorD: "#52565f",
      colorE: "#ffffff"
    },
    brand: {
      primary: "#01b9af",
      success: "#00938b",
      info: "#f3f3f3",
      warning: "#52565f",
      danger: "#40434E"
    }
  });

});
