var requestPromise = require('request-promise-native')

var md5 = require('md5')

var LRU = require('lru-cache')

var signature = require('./signature')

function Database (apiKey) {
  if (!(this instanceof Database)) {
    return new Database(apiKey)
  }

  this.apiKey = apiKey

  this.requestUserAgent = 'Access Watch Javascript Database Library'

  this.apiBaseUrl = 'https://api.access.watch'

  this.apiVersion = '1.2'

  // We should be able to pass the cache in the configuration
  if (!this.cache) {
    // Should we be able to pass the cache settings in the configuration?
    const cacheSize = 10000
    const maxAge = 1 * 60 * 60
    this.cache = LRU({max: cacheSize, maxAge: maxAge})
  }
}

Database.prototype = {

  getAddress: function (address, params) {
    // Here instead of forwarding the params we could create our own JS params (withActivity: Boolean for example)
    // And translate them into the API equivalent (include_activity: 1)
    const options = {
      json: true,
      method: 'GET',
      url: `${this.resolveEndpoint('address')}/${address}`,
      cacheKey: ['address', md5(address)].join('_'),
      qs: params
    }

    return this.apiRequest(options)
      .catch(err => {
        throw err
      })
  },

  getRobot: function (robot, params) {
    const robotId = robot.urlid || robot.uuid

    const options = {
      json: true,
      method: 'GET',
      url: `${this.resolveEndpoint('robot')}/${robotId}`,
      cacheKey: ['robot', md5(robotId)].join('_'),
      qs: params
    }

    return this.apiRequest(options)
      .catch(err => {
        throw err
      })
  },

  getIdentity: function ({address, userAgent, headers}) {
    const identityId = signature.getIdentityId({address, userAgent, headers})

    const options = {
      method: 'POST',
      url: `${this.resolveEndpoint('identity')}`,
      cacheKey: ['identity', identityId].join('_'),
      json: {address, userAgent, headers}
    }

    return this.apiRequest(options)
      .catch(err => {
        throw err
      })
  },

  apiRequest: function (options) {
    options.headers = {
      'User-Agent': this.requestUserAgent,
      'Api-Key': this.apiKey
    }

    if (this.cache && options.cacheKey) {
      const object = this.cache.get(options.cacheKey)
      if (object !== undefined) {
        return Promise.resolve(object)
      }
    }

    return requestPromise(options)
      .then(body => {
        if (typeof body !== 'object') {
          throw 'Received body was not an object'
        }
        this.cache.set(options.cacheKey, body)
        return body
      })
      .catch(err => {
        throw err
      })
  },

  resolveEndpoint: function (endpoint) {
    return [this.apiBaseUrl, this.apiVersion, 'database', endpoint].join('/')
  }

}

module.exports = Database
