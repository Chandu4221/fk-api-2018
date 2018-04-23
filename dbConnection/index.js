var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'flipkart'
});
connection.connect();

connection.query("drop table if exists productFeedListing");
connection.query("drop table if exists nextUrls");
connection.query("drop table if exists productsFeed");

connection.query(`create table productFeedListing ( 
  category_id int(10) AUTO_INCREMENT,
  category_name varchar(100),
  getUrl varchar(200),
  deltaGetUrl varchar(200),
  PRIMARY KEY(category_id) 
)`);

connection.query(`create table nextUrls (
  nextUrl_id int(30) AUTO_INCREMENT,
  category_name varchar(200),
  nextUrl varchar(200) NOT NULL,
  PRIMARY KEY (nextUrl_id) 
)`);


connection.query(`create table productsFeed (
  p_id int(20) AUTO_INCREMENT,
  p_category varchar(20),
  p_title varchar(500),
  p_img_small varchar(500),
  p_img_medium varchar(500),
  p_img_large varchar(500),
  p_retail_price int(100),
  p_retail_currency varchar(10),
  p_productUrl varchar(500),
  p_productBrand varchar(500),
  p_instock tinyint(1),
  p_cod tinyint(1),
  PRIMARY KEY (p_id)
)`);

module.exports = connection;