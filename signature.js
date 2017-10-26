var md5 = require('md5')

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
    throw 'Missing or invalid argument: address'
  }
  if (typeof headers === 'object') {
    return getIdentityIdWithHeaders({address, headers})
  }
  if (typeof userAgent === 'string') {
    return getIdentityIdWithUserAgent({address, userAgent})
  } else {
    throw 'Missing or invalid argument: userAgent or headers'
  }
}

function getIdentityIdWithHeaders ({address, headers}) {
  return md5(getHeadersSignature(headers) + md5(address))
}

function getIdentityIdWithUserAgent ({address, userAgent}) {
  return md5(md5(address) + md5(userAgent))
}

function getHeadersSignature (headers) {
  let lowerCaseHeaders = {}
  for (let key in headers) {
    if (headers.hasOwnProperty(key)) {
      lowerCaseHeaders[key.toLowerCase()] = headers[key]
    }
  }

  let obj = {}
  for (let key in identityHeaders) {
    if (identityHeaders.hasOwnProperty(key) && lowerCaseHeaders.hasOwnProperty(key)) {
      let normalisedKey = identityHeaders[key]
      obj[normalisedKey] = lowerCaseHeaders[key]
    }
  }

  let string = Object.keys(obj).map(key => [key, obj[key]].join(':')).join(';') + ';'

  let hash = md5(string)

  return hash
}

module.exports = {
  identityHeaders,
  getIdentityId,
  getIdentityIdWithUserAgent,
  getIdentityIdWithHeaders,
  getHeadersSignature
}
