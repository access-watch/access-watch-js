const reputation = require('./reputation');
const country = require('./country');
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
    values: ['Head', 'Get', 'Post', 'Put', 'Delete']
  }, {
    id: 'response.status',
    label: 'status',
  }, {
    id: 'request.url',
    label: 'url',
    fullText: true
  }, {
    id: 'identity.name',
    fullText: true,
  },
  reputation,
  ...addressSharedFilters.map(
    filter => Object.assign({}, filter, { id: `address.${filter.id}`} )
  ),
  country,
];
