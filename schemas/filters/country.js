const countries = {
  FR: 'France',
  DE: 'Germany',
};

module.exports = {
  id: 'country_code',
  label: 'country',
  values: Object.keys(countries).filter(code => code.length === 2),
  valueToLabel: countryCode => countries[countryCode]
};
