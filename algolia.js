const algoliaSearch = require('algoliasearch');

const client = algoliaSearch('OZ6NPSESCS', '155946d19b7f7ba05b54384df1e85c71');

exports.expertIndex = client.initIndex('experts');
exports.userIndex = client.initIndex('lawProfessionals');
