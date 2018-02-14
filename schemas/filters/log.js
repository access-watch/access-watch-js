const reputation = require('./reputation');
const addressSharedFilters = require('./address_shared');

module.exports = [
  {
    id: 'identity.type',
    label: 'type',
    values: ['browser', 'robot'],
    valueToLabel: type => type === 'browser' ? 'Human' : 'Robot'
  },
  {
    id: 'request.method',
    label: 'method',
    values: ['HEAD', 'GET', 'POST', 'PUT', 'DELETE']
  }, {
    id: 'response.status',
    label: 'status',
  }, {
    id: 'request.url',
    label: 'url',
    fullText: true
  }, {
    id: 'user_agent.value',
    fullText: true,
  },
  reputation,
  ...addressSharedFilters.map(filter => Object.assign(
    {},
    filter, {
      id: `address.${filter.id}`
    },
    filter.label ?  {
      label: `address.${filter.label}`
    } : {}
  )),
];
