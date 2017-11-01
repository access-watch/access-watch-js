const request = require('axios')

const md5 = require('md5')

const LRU = require('lru-cache')

const signature = require('./signature')

function Database (apiKey) {
  if (!(this instanceof Database)) {
    return new Database(apiKey)
  }

  this.apiKey = apiKey

  this.apiUserAgent = 'Access Watch Javascript Database Library'

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
    const addressId = signature.getAddressId(address)

    const options = {
      method: 'GET',
      url: `${this.resolveEndpoint('address')}/${address}`,
      cacheKey: ['address', addressId].join('_'),
      params: params
    }

    return this.apiRequest(options)
  },

  getRobot: function (robot, params) {
    const robotId = robot.urlid || robot.uuid

    const options = {
      method: 'GET',
      url: `${this.resolveEndpoint('robot')}/${robotId}`,
      cacheKey: ['robot', md5(robotId)].join('_'),
      params: params
    }

    return this.apiRequest(options)
  },

  getIdentity: function ({address, userAgent, headers}) {
    const identityId = signature.getIdentityId({address, userAgent, headers})

    const options = {
      method: 'POST',
      url: `${this.resolveEndpoint('identity')}`,
      cacheKey: ['identity', identityId].join('_'),
      data: {address, userAgent, headers}
    }

    return this.apiRequest(options)
  },

  apiRequest: function (options) {
    options.headers = {
      'User-Agent': this.apiUserAgent
    }

    if (this.apiKey) {
      options.headers['Api-Key'] = this.apiKey
    }

    if (this.cache && options.cacheKey) {
      const object = this.cache.get(options.cacheKey)
      if (object !== undefined) {
        return Promise.resolve(object)
      }
    }

    return request(options)
      .then(response => {
        if (typeof response.data !== 'object') {
          throw new Error('Received body was not an object')
        }
        if (this.cache && options.cacheKey) {
          this.cache.set(options.cacheKey, response.data)
        }
        return response.data
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          throw new Error(err.response.data.message)
        } else {
          throw err
        }
      })
  },

  resolveEndpoint: function (endpoint) {
    return [this.apiBaseUrl, this.apiVersion, 'database', endpoint].join('/')
  }

}

module.exports = Database
