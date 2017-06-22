/*!
 * molgenis-i18n v0.0.3 
 * (c) 2017 Genomics Coordination Center
 * Released under the LGPL-3.0 License.
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var i18next = _interopDefault(require('i18next'));
var XHR = _interopDefault(require('i18next-xhr-backend'));
var moment = _interopDefault(require('moment'));
var moment_locale_pt = require('moment/locale/pt');
var moment_locale_es = require('moment/locale/es');
var moment_locale_it = require('moment/locale/it');
var moment_locale_fr = require('moment/locale/fr');
var moment_locale_nl = require('moment/locale/nl');
var moment_locale_de = require('moment/locale/de');

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

module.exports = plugin;
