const reputation = require("./reputation");

module.exports = [
  reputation,
  {
    id: "name",
    fullText: true
  },
  {
    id: "type",
    values: [
      "crawler",
      "rss",
      "monitoring",
      "security",
      "seo",
      "social",
      "advertising",
      "tor"
    ]
  }
];
