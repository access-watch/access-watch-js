const reputation = require('./reputation');

module.exports = [
  {
    id: 'name',
    fullText: true,
    showInPanel: true,
  },
  {
    id: 'flags',
    label: 'type',
    values: ['crawler', 'rss', 'monitoring', 'security', 'seo', 'social', 'advertising', 'tor'],
    showInPanel: true,
  },
  reputation
];
