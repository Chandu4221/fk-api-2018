var express = require('express');
var router = express.Router();
var dbConnection = require('../../dbConnection');
var fkClient = require('../fkClient');

/********* update all products of that catagory *****************/
router.get('/:category',function(req,res,next){
    dbConnection.query("select * from productsFeed where p_category = '"+req.params.category+"'",function(error,results,fields){
        res.render('products',{
            title:"Products in "+req.params.category,
            products:results
        });
    });
});

module.exports = router;