const reputation = require('./reputation')
const addressFilters = require('./address')
const robotFilters = require('./robot')

const statusCodes = [
  100, 101, 102,
  200, 201, 202, 203, 204, 205, 206, 207, 210, 226,
  300, 301, 302, 303, 304, 305, 307, 308, 310,
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414,
  415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 444, 449,
  450, 451, 456, 495, 496, 497, 499,
  500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511
]

const addressesShowInPanel = ['address.value', 'address.hostname', 'address.country_code']
const addressesDontInclude = ['rule.type']

const robotsShowInPanel = ['robot.name']
const robotsDontInclude = ['rule.type']

module.exports = [
  {
    id: 'identity.type',
    values: ['browser', 'robot'],
    valueToLabel: type => (type === 'browser' ? 'Human' : 'Robot'),
    showInPanel: true
  },
  reputation,
  ...robotFilters
    .filter(({ id }) => robotsDontInclude.indexOf(id) === -1)
    .map(filter =>
      Object.assign(
        {},
        filter,
        {
          showInPanel: robotsShowInPanel.indexOf(filter.id) !== -1
        },
        filter.label
          ? {
            label: `robot.${filter.label}`
          }
          : {}
      )
    ),
  ...addressFilters
    .filter(({ id }) => addressesDontInclude.indexOf(id) === -1)
    .map(filter =>
      Object.assign(
        {},
        filter,
        {
          showInPanel: addressesShowInPanel.indexOf(filter.id) !== -1
        },
        filter.label
          ? {
            label: `address.${filter.label}`
          }
          : {}
      )
    ),
  {
    id: 'request.method',
    values: ['HEAD', 'GET', 'POST', 'PUT', 'DELETE'],
    showInPanel: true
  },
  {
    id: 'request.headers.host',
    label: 'request.host',
    fullText: true,
    showInPanel: true
  },
  {
    id: 'request.url',
    fullText: true,
    showInPanel: true
  },
  {
    id: 'response.status',
    transform: status => parseInt(status, 10),
    values: statusCodes,
    showInPanel: true
  }
]
