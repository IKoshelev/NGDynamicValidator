exports.config = {
  allScriptsTimeout: 11000,


  specs: [
    'e2e/specs/*.js'
  ],


  capabilities: {
    'browserName': 'chrome'
  },


  baseUrl: 'http://localhost:8000/e2e/',


  framework: 'jasmine',


  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
