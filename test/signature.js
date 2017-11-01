/* eslint-env mocha */

const assert = require('assert')

const signature = require('../signature')

const bingAddress = '40.77.167.149'
const bingUserAgent = 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
const bingHeaders = {'User-Agent': bingUserAgent, 'Accept': '*/*', 'From': 'bingbot(at)microsoft.com'}

describe('Signature', function () {
  it('should return the right address id for bing address', function () {
    assert.equal(signature.getAddressId(bingAddress), 'a29cfb77c4fd58e2dc894ac6f80e142b')
  })

  it('should return the right user agent id for bing user agent', function () {
    assert.equal(signature.getUserAgentId(bingUserAgent), 'd8535ad6fd8ced25f6f25197a820deef')
  })

  it('should return the right headers signature id for bing headers', function () {
    assert.equal(signature.getHeadersSignatureId(bingHeaders), 'b5432b73339d421d2e1a4acdad050140')
  })

  it('should return the right identity id for bing user agent and address', function () {
    assert.equal(signature.getIdentityId({address: bingAddress, userAgent: bingUserAgent}), '307c90f9ac9fd4f9de75cfb9d495c4c1')
  })

  it('should return the right identity id for bing headers and address', function () {
    assert.equal(signature.getIdentityId({address: bingAddress, headers: bingHeaders}), '4cedce478aeac7ab7a3e502d2a9cdc59')
  })

  it('should throw an error if address is missing', function () {
    assert.throws(function () { signature.getIdentityId({headers: bingHeaders}) }, Error)
  })

  it('should throw an error if address is not a string', function () {
    assert.throws(function () { signature.getIdentityId({address: true, headers: bingHeaders}) }, Error)
  })

  it('should throw an error if headers and user agent are missing', function () {
    assert.throws(function () { signature.getIdentityId({address: bingAddress}) }, Error)
  })

  it('should throw an error if user agent is not a string', function () {
    assert.throws(function () { signature.getIdentityId({address: bingAddress, userAgent: true}) }, Error)
  })

  it('should throw an error if headers is not an object', function () {
    assert.throws(function () { signature.getIdentityId({address: bingAddress, headers: true}) }, Error)
  })
})
