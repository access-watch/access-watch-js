var requestPromise = require('request-promise-native')

var md5 = require('md5')

var LRU = require('lru-cache')

function AccessWatchDatabase (apiKey) {
  if (!(this instanceof AccessWatchDatabase)) {
    return new AccessWatchDatabase(apiKey)
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

AccessWatchDatabase.prototype = {

  addressData: function (address, params) {
    // Here instead of forwarding the params we could create our own JS params (withActivity: Boolean for example)
    // And translate them into the API equivalent (include_activity: 1)
    const options = {
      json: true,
      method: 'GET',
      url: [this.apiBaseUrl, this.apiVersion, 'database', 'address', address].join('/'),
      cacheKey: ['address', md5(address)].join('_'),
      qs: params,
    }

    return this.apiRequest(options)
      .catch(err => {
        console.log('addressData error', err)
        throw err;
      })
  },

  batchAddressData: function (addresses) {
    const options = {
      method: 'POST',
      url: [this.apiBaseUrl, this.apiVersion, 'database', 'addresses'].join('/'),
      json: addresses
    }

    return this.apiRequest(options)
      .then(result => {
        return result && result.hasOwnProperty('addresses') ? result.addresses : []
      }).catch(err => {
        console.log('batchAddressData', err, result)
        throw err
      })
  },

  batchIdentityData: function (identities) {
    const options = {
      method: 'POST',
      url: [this.apiBaseUrl, this.apiVersion, 'database', 'identities'].join('/'),
      json: identities
    }

    return this.apiRequest(options)
      .then(result => {
        return result && result.hasOwnProperty('identities') ? result.identities : []
      }).catch(err => {
        console.log('batchIdentityData', err, result)
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
        callback(null, object)
        return
      }
    }

    return requestPromise(options)
      .then(body => {
        if (typeof body === 'object') {
          this.cache.set(options.cacheKey, body)
          return body
        }
        return
      })
      .catch(err => {
        console.log('error from request', err)
        throw err
      })
  }

}

module.exports = AccessWatchDatabase
