var express = require('express');
var router = express.Router();
var repo = require("../repo/goods-repo")
var audit=require('../utils/audit-utils')
var goodsViewRepo = require('../repo/goodsViewLog-repo')

/* goods page. */
router.all('/goods/page',function(req, res, next) {
    req.body.page=req.body.page||req.query.page||1
    req.body.size=req.body.size||req.query.size||10
    repo.queryPage(req.body,r=>{
        res.json(r)
    })
})

router.all('/goods/stat',async function(req, res, next) {
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
        localDate=localDate.add(1, 'days')
    }
    dm.dates=dates
    dm.datas=datas
    res.json({success:true,data:dm})
})

router.all('/goods/all', function(req, res, next) {
    repo.queryAll(req.body,r=>{
        res.json(r)
    })
})

router.all('/goods/one', function(req, res, next) {
    goodsViewRepo.save({goodsId:req.body.id,userId:req.body.userId},r=>{})
    repo.queryById(req.body,r=>{
        res.json(r)
    })
})

router.all('/goods/save', function(req, res, next) {
    audit.fillData(req,req.body)
    repo.save(req.body,r=>{
        res.json(r)
    })
})

router.all('/goods/delete', function(req, res, next) {
    repo.deleteById(req.body,r=>{
        res.json(r)
    })
})

module.exports = router;
