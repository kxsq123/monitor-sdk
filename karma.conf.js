module.exports = function (config) {
	const cfg = {
		basePath: '.',
		frameworks: ['jasmine'],
		browsers: ['Chrome'],
		reporters: ['mocha', 'coverage'],
		files: [
			'src/main.js',
			'src/performance.js',
			'test/spec/performance.spec.js',
			'test/spec/errorHandler.spec.js'
		],
    coverageReporter: {
      dir: './test/coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
		},
		preprocessor: {
			'src/errorHandler.js': ['coverage'],
			'src/performance.js': ['coverage'],
		},
		rollupPreprocessor: {
			plugins: [
				require('rollup-plugin-buble')(),
			],
			format: 'iife',
			moduleName: 'boss_monitor',
			sourceMap: 'inline',
		},
		customPreprocessors: {
			// Clones the base preprocessor, but overwrites
			// its options with those defined below.
			rollupBabel: {
				base: 'rollup',
				options: {
					// In this case, to use
					// a different transpiler:
					plugins: [
						require('rollup-plugin-node-resolve')(),
						require('rollup-plugin-istanbul')(),
						require('rollup-plugin-babel')()
					],
				}
			}
		}
	}

	cfg.browserDisconnectTimeout = 30000;
	cfg.browserNoActivityTimeout = 30000;
	cfg.processKillTimeout = 30000;
	cfg.preprocessors = {
		'src/**/*.js': ['rollupBabel'],
		'test/**/*.spec.js': ['rollupBabel']
	};

	config.set(cfg);
};
