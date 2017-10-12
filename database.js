var request = require('request')

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

  addressData: function (address, callback) {
    const options = {
      json: true,
      method: 'GET',
      url: [this.apiBaseUrl, this.apiVersion, 'database', 'address', address].join('/'),
      cacheKey: ['address', md5(address)].join('_')
    }

    return this.apiRequest(options, (err, result) => {
      if (!err) {
        callback(result)
      } else {
        console.log('addressData error', err)
        callback()
      }
    })
  },

  batchAddressData: function (addresses, callback) {
    const options = {
      method: 'POST',
      url: [this.apiBaseUrl, this.apiVersion, 'database', 'addresses'].join('/'),
      json: addresses
    }

    return this.apiRequest(options, (err, result) => {
      if (result && result.addresses) {
        callback(result.addresses)
      } else {
        console.log('batchAddressData', err, result)
        callback()
      }
    })
  },

  batchIdentityData: function (identities, callback) {
    const options = {
      method: 'POST',
      url: [this.apiBaseUrl, this.apiVersion, 'database', 'identities'].join('/'),
      json: identities
    }

    return this.apiRequest(options, (err, result) => {
      if (result && result.identities) {
        callback(result.identities)
      } else {
        console.log('batchIdentityData', err, result)
        callback()
      }
    })
  },

  apiRequest: function (options, callback) {
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

    request(options, (err, response, body) => {
      if (err) {
        console.log('error from request', err)
        callback(err)
        return
      }

      if (typeof body !== 'object') {
        console.log('body not an object', body)
        callback()
        return
      }

      if (this.cache && options.cacheKey) {
        this.cache.set(options.cacheKey, body)
      }

      callback(null, body)
    })
  }

}

module.exports = AccessWatchDatabase
