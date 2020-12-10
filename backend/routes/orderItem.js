var express = require('express');
var router = express.Router();
var repo = require("../repo/orderItem-repo")
var audit=require('../utils/audit-utils')

/* orderItem page. */
router.all('/orderItem/page', function(req, res, next) {
    req.body.page=req.body.page||req.query.page||1
    req.body.size=req.body.size||req.query.size||10
    repo.queryPage(req.body,r=>{
        res.json(r)
    })
})

router.all('/orderItem/all', function(req, res, next) {
    repo.queryAll(req.body,r=>{
        res.json(r)
    })
})

router.all('/orderItem/one', function(req, res, next) {
    repo.queryById(req.body,r=>{
        res.json(r)
    })
})

router.all('/orderItem/save', function(req, res, next) {
    audit.fillData(req,req.body)
    repo.save(req.body,r=>{
        res.json(r)
    })
})

router.all('/orderItem/delete', function(req, res, next) {
    repo.deleteById(req.body,r=>{
        res.json(r)
    })
})

module.exports = router;
