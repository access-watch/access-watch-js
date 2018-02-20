const reputation = require('./reputation');
const country = require('./country');

module.exports = [{
  id: 'value',
  label: 'ip',
  fullText: true
}, {
  id: 'hostname',
  fullText: true
}, {
  id: 'as_number'
}, {
  id: 'network_name',
  fullText: true
}, country
, {
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
  ]
}, reputation ];
