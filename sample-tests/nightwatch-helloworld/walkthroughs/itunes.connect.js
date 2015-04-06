// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api

module.exports = {
  tags: ["itunes", "publish", "marketing", "signIn"],
  "iTunesConnect" : function (client) {
    client
      .resizeWindow(1024, 768)

      //============================================================================================
      .sectionBreak("A. Demo User SignIn")

      .url("http://localhost:3000/entrySignIn")
      .waitForPage("#entrySignIn")
      .saveScreenshot("tests/nightwatch/screenshots/iTunesConnect/A-signInPage.png")
      .reviewSignInPage()

      //============================================================================================
      .sectionBreak("B. Marketing, Support, and Privacy")

      .url("http://localhost:3000/marketing")
      .waitForPage("#marketingPage")
      .saveScreenshot("tests/nightwatch/screenshots/iTunesConnect/A-marketingPage.png")

      .url("http://localhost:3000/support")
      .waitForPage("#supportPage")
      .saveScreenshot("tests/nightwatch/screenshots/iTunesConnect/A-supportPage.png")

      .url("http://localhost:3000/privacy")
      .waitForPage("#privacyPage")
      .saveScreenshot("tests/nightwatch/screenshots/iTunesConnect/A-privacyPage.png")

      .end();
  }
};
