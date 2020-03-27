
// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/);
// const testsContext = require.context('./specs', true, /CombieExamDetail\.spec$/); // 只想测试某个组件，就修改这一行，如果测试全部，则将本行注释，上一行放开
testsContext.keys().forEach(testsContext);

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../src', true, /^\.\/(?!main(\.js)?$)/);
srcContext.keys().forEach(srcContext);