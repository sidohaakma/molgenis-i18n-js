/*!
 * molgenis-i18n v0.0.3 
 * (c) 2017 Genomics Coordination Center
 * Released under the LGPL-3.0 License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('i18next'), require('i18next-xhr-backend'), require('moment'), require('moment/locale/pt'), require('moment/locale/es'), require('moment/locale/it'), require('moment/locale/fr'), require('moment/locale/nl'), require('moment/locale/de')) :
  typeof define === 'function' && define.amd ? define(['i18next', 'i18next-xhr-backend', 'moment', 'moment/locale/pt', 'moment/locale/es', 'moment/locale/it', 'moment/locale/fr', 'moment/locale/nl', 'moment/locale/de'], factory) :
  (global.MolgenisI18n = factory(global.i18next,global.XHR,global.moment,global.moment_locale_pt,global.moment_locale_es,global.moment_locale_it,global.moment_locale_fr,global.moment_locale_nl,global.moment_locale_de));
}(this, (function (i18next,XHR,moment,moment_locale_pt,moment_locale_es,moment_locale_it,moment_locale_fr,moment_locale_nl,moment_locale_de) { 'use strict';

i18next = 'default' in i18next ? i18next['default'] : i18next;
XHR = 'default' in XHR ? XHR['default'] : XHR;
moment = 'default' in moment ? moment['default'] : moment;

/*  */

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
function plugin (Vue, options) {
  var namespace = options.namespace;
  var lng = options.lng;
  var fallbackLng = options.fallbackLng;
  var callback = options.callback;

  var t = function (key, options) { return i18next.t(key, options); };

  Vue.prototype.$lng = lng;
  Vue.prototype.$i18n = i18next;
  Vue.prototype.$t = t;
  Vue.prototype._ = t;
  Vue.filter('i18n', t);
  Vue.filter('moment', function (value, format) { return moment(value).format(format); });
  moment.locale(lng);

  var i18nOptions = {
    lng: lng,
    fallbackLng: fallbackLng,
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
  };

  if (i18next.isInitialized) {
    console.log('i18next already initialized, reload page!');
    callback && callback();
  } else {
    console.log('Initializing i18next...');
    i18next
      .use(XHR)
      .init(i18nOptions, function () {
        console.log('I18Next initialized! Language: ' + i18next.language);
        callback && callback();
      });
  }
}

plugin.version = '0.0.3';

return plugin;

})));
