const countries = require('./countries.json');

module.exports = {
  id: 'country_code',
  label: 'country',
  values: Object.keys(countries).filter(code => code.length === 2),
  valueToLabel: countryCode => countries[countryCode]
};
