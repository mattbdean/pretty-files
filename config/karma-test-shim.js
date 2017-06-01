// require all test files (files that ends with .spec.js)
const testsContext = require.context('../app', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
