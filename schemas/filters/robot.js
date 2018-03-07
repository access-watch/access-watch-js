const reputation = require('./reputation')
const rule = require('./rule')

module.exports = [
  {
    id: 'robot.name',
    fullText: true,
    showInPanel: true
  },
  {
    id: 'robot.flags',
    label: 'type',
    values: ['crawler', 'rss', 'monitoring', 'security', 'seo', 'social', 'advertising', 'tor'],
    showInPanel: true
  },
  Object.assign({}, reputation, {id: `robot.${reputation.id}`}),
  rule,
]
