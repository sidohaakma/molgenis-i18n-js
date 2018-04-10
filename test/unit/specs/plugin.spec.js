import i18next from 'i18next'
import Plugin from '../../../src/plugin'
import sinon from 'sinon'
import Vue from 'vue'
import { createLocalVue } from '@vue/test-utils'

describe('MOLGENIS Vue i18n plugin', () => {
  let xhr
  let requests = []

  const responses = {
    test: {
      nl: {
        tokenNL: 'token nl'
      },
      de: {
        tokenNL: 'token de',
        tokenDE: 'token de'
      },
      en: {
        tokenEN: 'token en'
      }
    },
    other: {
      nl: {
        tokenNL: 'token nl'
      },
      de: {
        tokenNL: 'token de',
        tokenDE: 'token de'
      },
      en: {
        tokenEN: 'token en'
      }
    }
  }

  const respond = (request) => {
    const regex = /^\/api\/v2\/i18n\/(\w+)\/(\w+)$/g
    const match = regex.exec(request.url)
    if (match) {
      const namespace = match[1]
      const language = match[2]
      console.log('responding to request for language ', language)
      request.respond(200, {}, JSON.stringify(responses[namespace][language]))
    } else {
      if (request.method === 'POST') {
        console.log('sending 200 for request to url', request.url, request.method)
        request.respond(200, {}, '')
      }
    }
  }

  beforeEach(function () {
    xhr = sinon.useFakeXMLHttpRequest()
    xhr.onCreate = function (request) {
      setTimeout(() => respond(request), 10)
      requests.push(request)
    }
  })

  afterEach(function () {
    xhr.restore()
    requests = []
  })

  describe('Install', () => {
    it('should call callback function', (done) => {
      const localVue = createLocalVue()
      if (i18next.isInitialized) {
        done()
      } else {
        localVue.use(Plugin, {
          lng: 'nl',
          fallbackLng: ['de', 'en'],
          namespace: ['test', 'other'],
          callback: done
        })
      }
    })
  })

  describe('Vue prototype', () => {
    let vm

    before(function (done) {
      const LocalVue = createLocalVue()
      LocalVue.use(Plugin, {
        lng: 'nl',
        fallbackLng: ['de', 'en'],
        namespace: 'test',
        callback: () => {}
      })
      vm = new LocalVue()
      Vue.nextTick(() => {
        done()
      })
    })

    it('should add language to Vue.$lng', () => {
      expect(vm.$lng).to.equal('nl', 'Language should be set to lng parameter')
    })

    it('should add translation function to Vue._', () => {
      expect(vm._('tokenNL')).to.equal('token nl')
    })

    it('should add translation function to Vue.$t', () => {
      expect(vm.$t('tokenNL')).to.equal('token nl')
    })

    it('should add i18next to Vue.$i18n', () => {
      expect(vm.$i18n).to.equal(i18next)
    })
  })

  describe('i18next configuration', () => {
    it('should set i18next language to lng', done => {
      expect(i18next.language).to.equal('nl')
      done()
    })

    it('should set i18next languages to lng plus the languages in fallbackLng', done => {
      expect(i18next.languages).to.deep.equal(['nl', 'de', 'en'])
      done()
    })

    it('should translate to the first available token', done => {
      expect(i18next.t('tokenNL')).to.equal('token nl')
      expect(i18next.t('tokenDE')).to.equal('token de')
      expect(i18next.t('tokenEN')).to.equal('token en')
      expect(i18next.t('token unknown')).to.equal('token unknown')
      done()
    })

    it('should post missing tokens to the correct URL', done => {
      i18next.t('token ABC')
      expect(requests[0].requestBody.startsWith('token%20ABC=token%20ABC'))
      done()
    })
  })

  describe('moment filter', () => {
    let vm

    before(function (done) {
      const LocalVue = createLocalVue()
      LocalVue.use(Plugin, {
        lng: 'nl',
        fallbackLng: ['de', 'en'],
        namespace: 'test'
      })

      vm = new LocalVue({
        template: '<div>{{ date | moment(\'LLLL\') }}</div>',
        data: {
          date: Date.UTC(2019, 11, 5, 20, 12, 2)
        }
      }).$mount()

      Vue.nextTick(() => {
        done()
      })
    })

    it('should format dates and times in the correct language', () => {
      expect(vm.$el.textContent).to.equal('donderdag 5 december 2019 21:12')
    })
  })

  describe('i18n in templates as template filter', () => {
    let vm

    before(function (done) {
      const LocalVue = createLocalVue()
      LocalVue.use(Plugin, {
        lng: 'nl',
        fallbackLng: ['de', 'en'],
        namespace: 'test'
      })

      vm = new LocalVue({
        template: '<div>{{ \'tokenNL\' | i18n }}</div>'
      }).$mount()

      Vue.nextTick(() => {
        done()
      })
    })

    it('should have i18n filter', () => {
      expect(vm.$el.textContent).to.equal('token nl')
    })
  })

  describe('i18n in templates as script filter', () => {
    let vm

    before(function (done) {
      const LocalVue = createLocalVue()
      LocalVue.use(Plugin, {
        lng: 'nl',
        fallbackLng: ['de', 'en'],
        namespace: 'test'
      })

      vm = new LocalVue({
        template: '<div>{{ $t(\'tokenNL\') }}</div>'
      }).$mount()

      Vue.nextTick(() => {
        done()
      })
    })

    it('should have $t function', () => {
      expect(vm.$el.textContent).to.equal('token nl')
    })
  })
})
