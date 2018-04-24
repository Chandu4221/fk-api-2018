var express = require('express');
var router = express.Router();
var dbConnection = require('../../dbConnection');
var fkClient = require('../fkClient');

/********* update all products of that catagory *****************/
router.get('/update/:category',function(req,res,next){
    dbConnection.query("select * from nextUrls where category_name = '"+req.params.category+"'",function(error,results,fields){
       
      results.forEach(function(result){

        fkClient.getProductsFeed(result.nextUrl).then(function(value){
            var json_data = JSON.parse(value.body);
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
        }).catch(function(err){
            console.log(err);
        });/*fkclient */ 

      }); /* results forEach*/
      
    });/*db connection */

    res.send("products updated");

});

module.exports = router;