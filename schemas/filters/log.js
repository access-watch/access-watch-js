const reputation = require('./reputation');
const addressFilters = require('./address');

const statusCodes = [
  100, 101, 102,
  200, 201, 202, 203, 204, 205, 206, 207, 210, 226,
  300, 301, 302, 303, 304, 305, 307, 308, 310,
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414,
  415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 444, 449,
  450, 451, 456, 495, 496, 497, 499,
  500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511
];

module.exports = [
  {
    id: 'identity.type',
    label: 'type',
    values: ['browser', 'robot'],
    valueToLabel: type => (type === 'browser' ? 'Human' : 'Robot')
  },
  {
    id: 'request.method',
    label: 'method',
    values: ['HEAD', 'GET', 'POST', 'PUT', 'DELETE']
  },
  {
    id: 'response.status',
    label: 'status',
    transform: status => parseInt(status, 10),
    values: statusCodes,
  },
  {
    id: 'request.url',
    label: 'url',
    fullText: true
  },
  {
    id: 'user_agent.value',
    fullText: true
  },
  reputation,
  ...addressFilters.map(filter =>
    Object.assign(
      {},
      filter,
      {
        id: `address.${filter.id}`
      },
      filter.label
        ? {
            label: `address.${filter.label}`
          }
        : {}
    )
  )
];
