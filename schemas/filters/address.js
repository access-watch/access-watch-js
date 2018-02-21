const reputation = require('./reputation')
const country = require('./country')

module.exports = [{
  id: 'value',
  label: 'ip',
  fullText: true,
  showInPanel: true
}, {
  id: 'hostname',
  fullText: true,
  showInPanel: true
}, {
  id: 'as_number',
  showInPanel: true
}, {
  id: 'network_name',
  fullText: true,
  showInPanel: true
}, country,
{
  id: 'flags',
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
}, reputation ]
