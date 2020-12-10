var express = require('express');
var router = express.Router();
var repo = require("../repo/user-repo")
var audit=require('../utils/audit-utils')
var bcrypt = require('bcryptjs')
var moment = require('moment')
/* user page. */
router.all('/user/page', function(req, res, next) {
    req.body.page=req.body.page||req.query.page||1
    req.body.size=req.body.size||req.query.size||10
    repo.queryPage(req.body,r=>{
        res.json(r)
    })
})

router.all('/user/all', function(req, res, next) {
    repo.queryAll(req.body,r=>{
        res.json(r)
    })
})

router.all('/user/one', function(req, res, next) {
    repo.queryById(req.body,r=>{
        res.json(r)
    })
})

router.all('/user/save', function(req, res, next) {
    audit.fillData(req,req.body)
    repo.save(req.body,r=>{
        res.json(r)
    })
})

router.all('/user/chgpwd', function(req, res, next) {
    var salt = bcrypt.genSaltSync();
    var hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password=hash
    audit.fillData(req,req.body)
    repo.chgPwd(req.body,r=>{
        res.json(r)
    })
})

router.all('/user/delete', function(req, res, next) {
    repo.deleteById(req.body,r=>{
        res.json(r)
    })
})

router.all('/user/stat',async function(req, res, next) {
    let map={};
    let dm={};
    map.success=true
    map.data=dm
    let localDate=moment().subtract(7, 'days')
    let dates=[]
    let datas=[]
    for(let i=0;i<8;i++){
        dates.push(localDate.format("YYYY/MM/DD"))
        let conts=await repo.stat(localDate.format("YYYY-MM-DD hh:mm:ss"),localDate.add(1, 'days').format("YYYY-MM-DD hh:mm:ss"));
        datas.push(conts.data[0]['count(*)']);
    }
    dm.dates=dates
    dm.datas=datas
    res.json({success:true,data:dm})
})

module.exports = router;
