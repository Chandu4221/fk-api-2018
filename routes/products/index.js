var express = require('express');
var router = express.Router();
var dbConnection = require('../../dbConnection');

router.get('/:category',function(req,res,next){
    res.send("all products of this category");
});


module.exports = router;