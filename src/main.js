// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import i18n from '../src/plugin'

Vue.config.productionTip = false

Vue.use(i18n, {
  lng: 'en',
  fallbackLng: 'en',
  namespace: ['demo', 'other'],
  callback () {
    /* eslint-disable no-new */
    new Vue({
      el: '#i18n-demo',
      template: `
<div class="container">
 <h1>Hello i18n</h1>
 
 <div class="row pt-3">
  <div class="col-12">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">key</th>
          <th scope="col">value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>hallo_label</td>
          <td>{{ 'hallo_label' | i18n}}</td>
        </tr>
        <tr>
          <td>good_by_label</td>
          <td>{{ 'good_by_label' | i18n }}</td>
        </tr>
        <tr>
          <td>turtle_label</td>
          <td>{{ 'other:turtle_label' | i18n }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</div>
`
    })
  }
})
