var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'flipkart'
});
connection.connect();
connection.query("create table productFeedListing( category_id int(10) AUTO_INCREMENT,category_name varchar(100), getUrl varchar(200), deltaGetUrl varchar(200), PRIMARY KEY(category_id) )");
connection.query("create table nextUrls (nextUrl_id int(30) AUTO_INCREMENT,category_name varchar(200),nextUrl varchar(200), PRIMARY KEY (nextUrl_id) )");
module.exports = connection;