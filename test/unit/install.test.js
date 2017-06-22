import i18next from 'i18next'
import plugin from '../../src/index'
import sinon from 'sinon'

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
      if (i18next.isInitialized) {
        done()
      } else {
        Vue.use(plugin, {
          lng: 'nl',
          fallbackLng: ['de', 'en'],
          namespace: 'test',
          callback: done
        })
      }
    })
  })

  describe('Vue prototype', () => {
    it('should add language to Vue.$lng', done => {
      const vm = new Vue()
      assert(vm.$lng === 'nl', 'Language should be set to lng parameter')
      done()
    })

    it('should add translation function to Vue._', done => {
      const vm = new Vue()
      assert(vm._('tokenNL') === 'token nl')
      done()
    })

    it('should add translation function to Vue.$t', done => {
      const vm = new Vue()
      assert(vm.$t('tokenNL') === 'token nl')
      done()
    })

    it('should add i18next to Vue.$i18n', done => {
      const vm = new Vue()
      assert(vm.$i18n === i18next)
      done()
    })
  })

  describe('i18next configuration', () => {
    it('should set i18next language to lng', done => {
      assert(i18next.language === 'nl')
      done()
    })

    it('should set i18next languages to lng plus the languages in fallbackLng', done => {
      assert.deepEqual(i18next.languages, ['nl', 'de', 'en'])
      done()
    })

    it('should translate to the first available token', done => {
      assert(i18next.t('tokenNL') === 'token nl')
      assert(i18next.t('tokenDE') === 'token de')
      assert(i18next.t('tokenEN') === 'token en')
      assert(i18next.t('token unknown') === 'token unknown')
      done()
    })

    it('should post missing tokens to the correct URL', done => {
      i18next.t('token ABC')
      assert(requests[0].requestBody.startsWith('token%20ABC=token%20ABC'))
      done()
    })
  })

  describe('moment filter', () => {
    it('should format dates and times in the correct language', done => {
      const vm = new Vue({
        template: '<div>{{ date | moment(\'LLLL\') }}</div>',
        data: {
          date: Date.UTC(2019, 11, 5, 20, 12, 2)
        }
      }).$mount()
      nextTick(() => {
        assert(vm.$el.textContent === 'donderdag 5 december 2019 21:12')
      }).then(done)
    })
  })

  describe('i18n in templates', () => {
    it('should have i18n filter', done => {
      const vm = new Vue({
        template: '<div>{{ \'tokenNL\' | i18n }}</div>'
      }).$mount()
      nextTick(() => {
        assert(vm.$el.textContent === 'token nl')
      }).then(done)
    })

    it('should have $t function', done => {
      const vm = new Vue({
        template: '<div>{{ $t(\'tokenNL\') }}</div>'
      }).$mount()
      nextTick(() => {
        assert(vm.$el.textContent === 'token nl')
      }).then(done)
    })
  })

  // describe('change language', () => {
  //   it('should update translations', done => {
  //     const vm = new Vue({
  //       template: '<div>{{ $t("tokenNL") }}</div>'
  //     }).$mount()
  //     assert(vm.$el.textContent === 'token nl')
  //     console.log('token is nl')
  //     i18next.changeLanguage('de', (arg1, arg2) => {
  //       console.log('changeLanguage callback', arg1, arg2)
  //       nextTick(() => {
  //         assert(vm.$el.textContent === 'token de')
  //         console.log('token is de')
  //       }).then(done)
  //     })
  //   })
  // })
})
