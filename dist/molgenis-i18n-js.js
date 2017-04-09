/*!
 * molgenis-i18n-js v0.0.2 
 * (c) 2017 Genomics Coordination Center
 * Released under the LGPL-3.0 License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.MolgenisI18nJs = factory());
}(this, (function () { 'use strict';

/*  */
function plugin (Vue, options) {
  if ( options === void 0 ) options = {};

  Vue.prototype.$add = function (a, b) {
    return a + b
  };
}

plugin.version = '0.0.2';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

return plugin;

})));
