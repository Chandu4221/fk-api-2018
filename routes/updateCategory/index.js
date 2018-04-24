var express = require('express');
var router = express.Router();
var dbConnection = require('../../dbConnection');
var fkClient = require('../fkClient');

router.get('/delete/:category',function(req,res,next){
  /*should delete all items in the category in db*/
  dbConnection.query("delete from nextUrls where category_name='"+req.params.category+"'");
  res.send(req.params.category+"'s all Next URL are Deleted");
});

router.get('/:category',function(req,res,next){
  /*should update the particular category*/
  
  /*get the category Url from the db by checking the category and return as a promise*/
  var getCategoryUrl = new Promise(function(resolve,reject){
    dbConnection.query(`select * from productFeedListing`,function(error,results,fields){
      results.forEach(function(result){
        if(req.params.category == result.category_name){
          resolve(result.getUrl);
        }
      });
    });
  });

  getCategoryUrl.then(function(getUrl){
    return new Promise(function(resolve,reject){
      /* this promise has to insert data into db and return the products */
        var insertProductsFromUrl = function(url){
          if(url==null)
            console.log(url);
          fkClient.getProductsFeed(url).then(function(data){

            /*run insert query on the products array*/

            var json_data = JSON.parse(data.body);
                /* get every product*/
                 json_data.products.forEach(function(product){
                /*insert into database */
                dbConnection.query(`insert into productsfeed(
                    p_title,
                    p_category,
                    p_img_small,
                    p_img_medium,
                    p_img_large,
                    p_retail_price,
                    p_retail_currency,
                    p_productUrl,
                    p_productBrand,
                    p_instock,
                    p_cod
                ) values (
                    "${product.productBaseInfoV1.title}",
                    "${req.params.category}",
                    "${product.productBaseInfoV1.imageUrls['200x200']}",
                    "${product.productBaseInfoV1.imageUrls['400x400']}",
                    "${product.productBaseInfoV1.imageUrls['800x800']}",
                    ${product.productBaseInfoV1.maximumRetailPrice.amount},
                    "${product.productBaseInfoV1.maximumRetailPrice.currency}",
                    "${product.productBaseInfoV1.productUrl}",
                    "${product.productBaseInfoV1.productBrand}",
                    ${product.productBaseInfoV1.inStock},
                    ${product.productBaseInfoV1.codAvailable}
                )`);
               });/* for each products*/

               if(data.nextUrl){
                insertProductsFromUrl(data.nextUrl);
                console.log(data.nextUrl);
               }
              else
                resolve("success");
          }).catch(function(error){
            console.log("error occured + \n");
            console.log(error);
          });
        }
        insertProductsFromUrl(getUrl);
    });
   
  }).then(function(tempData){
    res.send(tempData);
  });
});


module.exports = router;
