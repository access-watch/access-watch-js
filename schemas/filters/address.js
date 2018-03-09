const reputation = require('./reputation')
const country = require('./country')
const rule = require('./rule')

module.exports = [{
  id: 'address.value',
  label: 'ip',
  fullText: true,
  showInPanel: true
}, {
  id: 'address.hostname',
  label: 'hostname',
  fullText: true,
  showInPanel: true
}, {
  id: 'address.as_number',
  label: 'as_number',
  showInPanel: true
}, {
  id: 'address.network_name',
  label: 'network_name',
  fullText: true,
  showInPanel: true
}, country,
{
  id: 'address.flags',
  label: 'type',
  values: [
    'broadband',
    'mobile',
    'server',
    'business',
    'corporate',
    'institution',
    'education',
    'wifi',
    'wimax',
    'sat',
    'vpn',
    'proxy',
    'cloud',
    'tor',
    'crawler',
    'robot'
  ],
  showInPanel: true
}, Object.assign(
  {},
  reputation, {
    id: `address.${reputation.id}`,
    label: 'reputation.status'
  }
), rule ]
