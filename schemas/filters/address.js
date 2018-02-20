const reputation = require('./reputation');
const country = require('./country');
const address = require('./address');
const sharedFilters = require('./address_shared');

module.exports = [ ...sharedFilters, reputation ];
