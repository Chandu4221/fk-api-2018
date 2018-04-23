var express = require('express');
var router = express.Router();
var dbConnection = require('../dbConnection');
var fkClient = require('./fkClient');

/* GET users listing. */
router.get('/:category', function(req, res, next) {

  fkClient.getProductsFeed('https://affiliate-api.flipkart.net/affiliate/1.0/feeds/krishnacc/category/6bo-5hp/5ad39d61e43a5edee0f10a65.json?expiresAt=1524497744744&sig=7f5d150638f0d9c85e4af68bd52c5f19').then(function(value){
    res.send(value.body);
  });



  //res.send("getProducts Data from DB"); 
});

router.get('/update',function(req,res,next){
  /*should update all items in the db*/
});

router.get('/update/:category',function(req,res,next){
  /*should update the particular category*/
  
  /*get the category Url from the db by checking the category*/
  var getCategoryUrl = new Promise(function(resolve,reject){
    dbConnection.query(`select * from productFeedListing`,function(error,results,fields){
      results.forEach(function(result){
        if(req.params.category == result.category_name){
          resolve(result.getUrl);
        }
      });
    });
  });
  

  getCategoryUrl.then(function(value){
    dbConnection.query("drop table if exists nextUrls;");
    dbConnection.query("create table nextUrls (nextUrl_id int(30) AUTO_INCREMENT,category_name varchar(200),nextUrl varchar(200), PRIMARY KEY (nextUrl_id)  )");

    return new Promise(function(resolve,reject){
      /*submit this url and get next url */

      function getNextUrl(url){
        if(url!==null)
          return fkClient.getProductsFeed(url).then(function(value){
            dbConnection.query("insert into nextUrls(category_name,nextUrl) values('"+req.params.category+"','"+JSON.parse(value.body).nextUrl+"')");
            getNextUrl(JSON.parse(value.body).nextUrl);
          });
        else
          return null;
      }
      getNextUrl(value);

    });
  }).then(function(result){
    res.send(result);
  }).catch(function(error){
    console.log(error);
  });
  



});


module.exports = router;
