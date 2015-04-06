// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api

module.exports = {
  "Layout & Static Pages" : function (client) {
    client
      .url("http://localhost:3000/entrySignIn")
      .resizeWindow(1024, 768)

      //============================================================================================
      .sectionBreak("A. Sign In Page")

      .waitForPage("#entrySignIn")
      .saveScreenshot("tests/nightwatch/screenshots/ipad/A-signInPage.png")
      .reviewSignInPage()
      .verify.elementNotPresent("#logoutButton")
      .signIn("janedoe@gmail.com", "janedoe123")


      //============================================================================================
      .sectionBreak("B. Home Page")

      .waitForPage("#todosListPage")
      .reviewMainLayout()
      .reviewSidebar()


      //============================================================================================
      .sectionBreak("C. Static Pages")

      .click("#aboutButton")
      .waitForPage("#aboutPage")

      .click("#eulaButton")
      .waitForPage("#eulaPage")

      .click("#privacyButton")
      .waitForPage("#privacyPage")

      .verify.elementPresent("#logoutButton")
      .signOut()
      .verify.elementNotPresent("#logoutButton")

      .end();
  }
};
