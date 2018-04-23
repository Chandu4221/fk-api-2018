var client = require('flipkart-api-affiliate-client');
var details = require('../fkAuth');
var fkClient = client({
  trackingId:details.trackingId,
  token:details.token,
},"json");

module.exports = fkClient;