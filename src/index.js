/* @flow */

import i18next from 'i18next'
import XHR from 'i18next-xhr-backend'
import moment from 'moment'
import 'moment/locale/pt'
import 'moment/locale/es'
import 'moment/locale/it'
import 'moment/locale/fr'
import 'moment/locale/nl'
import 'moment/locale/de'

/**
 * I18next Vue module for MOLGENIS.
 *
 * @param Vue the Vue class
 * @param options the options to use
 * @param options.namespace the namespace for this application
 * @param options.lng the user's language
 * @param options.fallbackLng the fallback languages to use
 * @param options.callback callback function to call once languages are available
 *
 * @see https://github.com/icebob/vue-express-mongo-boilerplate/blob/master/client/app/core/i18next.js
 */
function plugin (Vue: any, options: {
  namespace: string,
  lng: string,
  fallbackLng?: string|Array<string>,
  callback?: () => void
}) {
  const {
    namespace,
    lng,
    fallbackLng,
    callback
  } = options

  const t = (key, options) => i18next.t(key, options)

  Vue.prototype.$lng = lng
  Vue.prototype.$i18n = i18next
  Vue.prototype.$t = t
  Vue.prototype._ = t
  Vue.filter('i18n', t)
  Vue.filter('moment', (value, format) => moment(value).format(format))
  moment.locale(lng)

  const i18nOptions = {
    lng,
    fallbackLng,
    ns: [namespace],
    defaultNS: namespace,
    load: 'languageOnly',
    saveMissing: true,
    saveMissingTo: 'current',
    backend: {
      loadPath: '/api/v2/i18n/{{ns}}/{{lng}}',
      addPath: '/api/v2/i18n/{{ns}}',
      allowMultiLoading: false,
      withCredentials: true
    }
  }

  if (i18next.isInitialized) {
    console.log('i18next already initialized, reload page!')
    callback && callback()
  } else {
    console.log('Initializing i18next...')
    i18next
      .use(XHR)
      .init(i18nOptions, () => {
        console.log('I18Next initialized! Language: ' + i18next.language)
        callback && callback()
      })
  }
}

plugin.version = '__VERSION__'

export default plugin

