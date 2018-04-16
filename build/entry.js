const path = require('path')
const flow = require('rollup-plugin-flow-no-whitespace')
const replace = require('rollup-plugin-replace')
const pack = require('../package.json')
const buble = require('rollup-plugin-buble')
const version = pack.version
const banner =
    `/*!
     * ${pack.name} v${pack.version}
     * (c) ${new Date().getFullYear()} ${pack.author.name}\n
     * Released under the ${pack.license} License.\n
     */`

const resolve = _path => path.resolve(__dirname, '../', _path)

module.exports = [
  // browser dev
  {
    file: resolve('dist/molgenis-i18n-js.esm.js'),
    format: 'es'
  }
].map(genConfig)

function genConfig (opts) {
  const config = {
    input: {
      input: resolve('src/plugin.js'),
      plugins: [
        flow(),
        buble(),
        replace({
          __VERSION__: version
        }),
      ]
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: 'molgenis-i18n-js'
    }
  }

  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  return config
}
