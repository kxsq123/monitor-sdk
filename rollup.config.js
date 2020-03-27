
import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import { minify } from 'uglify-es';
import resolve from 'rollup-plugin-node-resolve';

const version = require('./package.json').version
const isProd = process.env.BUILD !== 'development'

export default [{
  input: './src/main.js',
  output: [
    {
      file: 'dist/monitor.esm.js',
      format: 'es'
    },
    {
      file: 'dist/monitor.common.js',
      format: 'cjs'
    },
    {
      file: 'dist/monitor.min.js',
      format: 'umd',
      // strict: false
    }
  ],
  plugins: isProd ? [
    resolve(),
    uglify.uglify({}, minify),
    buble({
      objectAssign: 'Object.assign',
      transforms: {
        forOf: false
      }
    }),
    replace({
      __VERSION__: version
    })
  ] : []
}]
