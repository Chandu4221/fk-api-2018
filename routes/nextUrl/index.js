var express = require('express');
var router = express.Router();
var dbConnection = require('../../dbConnection');
var fkClient = require('../fkClient');

router.get('/delete/:category',function(req,res,next){
  /*should delete all items in the category in db*/
  dbConnection.query("delete from nextUrls where category_name='"+req.params.category+"'");
  res.send(req.params.category+"'s all Next URL are Deleted");
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
    //dbConnection.query("drop table if exists nextUrls;");
    return new Promise(function(resolve,reject){
      /*submit this url and get next url */
      function getNextUrl(url){
        fkClient.getProductsFeed(url).then(function(urlValue){
          if(JSON.parse(urlValue.body).nextUrl !== null)
          {
            dbConnection.query("insert into nextUrls(category_name,nextUrl) values('"+req.params.category+"','"+JSON.parse(urlValue.body).nextUrl+"')");
            getNextUrl(JSON.parse(urlValue.body).nextUrl);
          }
        });
      }

      getNextUrl(value);
      resolve("success");
    });
  }).then(function(result){
    res.send(result);
  }).catch(function(error){
    console.log(error);
  });
});


module.exports = router;
