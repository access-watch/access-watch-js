const md5 = require('md5')

const identityHeaders = {
  'accept': 'Accept',
  'accept-charset': 'Accept-Charset',
  'accept-encoding': 'Accept-Encoding',
  'accept-language': 'Accept-Language',
  'dnt': 'Dnt',
  'from': 'From',
  'user-agent': 'User-Agent'
}

function getIdentityId ({address, userAgent, headers}) {
  if (typeof address !== 'string') {
    throw new Error('Missing or invalid argument: address')
  }
  if (typeof headers === 'object') {
    return getIdentityIdWithHeaders({address, headers})
  } else if (typeof userAgent === 'string') {
    return getIdentityIdWithUserAgent({address, userAgent})
  } else {
    throw new Error('Missing or invalid argument: userAgent or headers')
  }
}

function getIdentityIdWithHeaders ({address, headers}) {
  return md5(getHeadersSignatureId(headers) + getAddressId(address))
}

function getIdentityIdWithUserAgent ({address, userAgent}) {
  return md5(getUserAgentId(userAgent) + getAddressId(address))
}

function getAddressId (address) {
  return md5(address)
}

function getUserAgentId (userAgent) {
  return md5(userAgent.substring(0, 1024))
}

function getHeadersSignatureId (headers) {
  let lowerCaseHeaders = {}
  Object.keys(headers).forEach(key => {
    lowerCaseHeaders[key.toLowerCase()] = headers[key]
  })

  let obj = {}
  Object.keys(identityHeaders).forEach(key => {
    if (lowerCaseHeaders.hasOwnProperty(key)) {
      let normalisedKey = identityHeaders[key]
      obj[normalisedKey] = lowerCaseHeaders[key]
    }
  })

  const string = Object.keys(obj).map(key => [key, obj[key]].join(':')).join(';') + ';'

  const hash = md5(string)

  return hash
}

module.exports = {
  identityHeaders,
  getIdentityId,
  getAddressId,
  getUserAgentId,
  getHeadersSignatureId
}
