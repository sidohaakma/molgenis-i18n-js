const fs = require('fs')
const pack = require('../package.json')

// update installation.md
const installation = fs
  .readFileSync('./gitbook/installation.md', 'utf-8')
  .replace(
    /https:\/\/unpkg\.com\/molgenis-i18n-js@[\d.]+.[\d]+\/dist\/molgenis-i18n-js\.js/,
    'https://unpkg.com/molgenis-i18n-js@' + pack.version + '/dist/molgenis-i18n-js.js.'
  )
fs.writeFileSync('./gitbook/installation.md', installation)
