var express = require('express');
var router = express.Router();
var dbConnection = require('../../dbConnection');
var fkClient = require('../fkClient');

router.get('/:category',function(req,res,next){
    /*should delete all items in the category in db*/
    dbConnection.query("delete from productsfeed where p_category='"+req.params.category+"'");
    res.send(req.params.category+"'s all Products are Deleted From Database");
  });

  module.exports = router;