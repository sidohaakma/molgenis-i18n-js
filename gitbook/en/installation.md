# Installation

### Direct Download / CDN

https://unpkg.com/molgenis-i18n-js/dist/molgenis-i18n-js

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/molgenis-i18n-js@0.0.2/dist/molgenis-i18n-js.js
 
Include molgenis-i18n-js after Vue and it will install itself automatically:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/molgenis-i18n-js/dist/molgenis-i18n-js.js"></script>
```

### NPM

    $ npm install molgenis-i18n-js

### Yarn

    $ yarn add molgenis-i18n-js

When used with a module system, you must explicitly install the `molgenis-i18n-js` via `Vue.use()`:

```javascript
import Vue from 'vue'
import MolgenisI18nJs from 'molgenis-i18n-js'

Vue.use(MolgenisI18nJs)
```

You don't need to do this when using global script tags.

### Dev Build

You will have to clone directly from GitHub and build `molgenis-i18n-js` yourself if
you want to use the latest dev build.

    $ git clone https://github.com/fdlk/molgenis-i18n-js.git node_modules/molgenis-i18n-js
    $ cd node_modules/molgenis-i18n-js
    $ npm install
    $ npm run build
