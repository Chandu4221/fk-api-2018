var express = require('express');
var router = express.Router();
var dbConnection = require('../../dbConnection');
var fkClient = require('../fkClient');

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
                    ${dbConnection.escape(product.productBaseInfoV1.title)},
                    ${dbConnection.escape(req.params.category)},
                    ${dbConnection.escape(product.productBaseInfoV1.imageUrls['200x200'])},
                    ${dbConnection.escape(product.productBaseInfoV1.imageUrls['400x400'])},
                    ${dbConnection.escape(product.productBaseInfoV1.imageUrls['800x800'])},
                    ${dbConnection.escape(product.productBaseInfoV1.maximumRetailPrice.amount)},
                    ${dbConnection.escape(product.productBaseInfoV1.maximumRetailPrice.currency)},
                    ${dbConnection.escape(product.productBaseInfoV1.productUrl)},
                    ${dbConnection.escape(product.productBaseInfoV1.productBrand)},
                    ${dbConnection.escape(product.productBaseInfoV1.inStock)},
                    ${dbConnection.escape(product.productBaseInfoV1.codAvailable)}
                )`);
               });/* for each products*/

               if(json_data.nextUrl){
                insertProductsFromUrl(json_data.nextUrl);
                console.log(json_data.nextUrl);
               }
              else
                resolve("Inserted Products Into The Database");
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
