var express = require('express');
var router = express.Router();
var dbConnection = require('../dbConnection');
var fkClient = require('./fkClient');

/* GET home page. */
router.get('/', function(req, res, next) {
  dbConnection.query("select * from productFeedListing",function(error,results,fields){
    if(error)
      res.send(error);
    else
      res.render("index",{
        title:"Product Listings",
        results:results
      });
  });
  
});


/**********************DB Queries************************/

router.get('/deleteListings',function(req,res,next){
  dbConnection.query("delete from productFeedListing");
  res.send("Deleted Listings Successfully");
});

router.get('/updateListings',function(req,res,next){

fkClient.getProductsFeedListing().then(function(value){
  /*convert string to json*/
  var jsonData = JSON.parse(value.body);
  /*get all listings keys*/
  var listings = Object.keys(jsonData.apiGroups.affiliate.apiListings);

  /*for each listing inser the get and deltaGet url into the DB*/
  listings.forEach(function(listing){
    var getUrl = jsonData.apiGroups.affiliate.apiListings[listing].availableVariants['v1.1.0'].get;
    var deltaGetUrl = jsonData.apiGroups.affiliate.apiListings[listing].availableVariants['v1.1.0'].deltaGet;

    /*Insert every listing into the database and throw if any error occured*/
    dbConnection.query("Insert into productFeedListing(category_name,getUrl,deltaGetUrl) value('"+listing+"','"+getUrl+"','"+deltaGetUrl+"')",function(error,results,fields){
      if (error) throw error;
    });
  });// foreach

  /* after inserting return a new promise with select all query*/
  return new Promise(function(resolve,reject){
      dbConnection.query("select * from productFeedListing",function(error,results,fields){
        if(error)
          reject(error);
        else
          resolve(results);
      });
  });
}).then(function(value){
  res.send(value);
});

});
module.exports = router;
