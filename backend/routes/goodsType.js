var express = require('express');
var router = express.Router();
var repo = require("../repo/goodsType-repo")
var audit=require('../utils/audit-utils')

/* goodsType page. */
router.all('/goodsType/page', function(req, res, next) {
    req.body.page=req.body.page||req.query.page||1
    req.body.size=req.body.size||req.query.size||10
    repo.queryPage(req.body,r=>{
        res.json(r)
    })
})

router.all('/goodsType/all', function(req, res, next) {
    repo.queryAll(req.body,r=>{
        res.json(r)
    })
})

router.all('/goodsType/cascadetype', function(req, res, next) {
    repo.cascadetype(req.body,r=>{
        res.json(r)
    })
})

router.all('/goodsType/one', function(req, res, next) {
    repo.queryById(req.body,r=>{
        res.json(r)
    })
})

router.all('/goodsType/save', function(req, res, next) {
    audit.fillData(req,req.body)
    repo.save(req.body,r=>{
        res.json(r)
    })
})

router.all('/goodsType/delete', function(req, res, next) {
    repo.deleteById(req.body,r=>{
        res.json(r)
    })
})

module.exports = router;
