var express = require('express');
var router = express.Router();
var moment = require('moment')
var repo = require("../repo/order-repo")
var audit=require('../utils/audit-utils')
var userRepo = require('../repo/user-repo')
var shoppingCartRepo = require('../repo/shoppingCart-repo')
var goodsRepo = require('../repo/goods-repo')
var goodsSkuRepo = require('../repo/goodsSku-repo')

/* order page. */
router.all('/order/stat',async function(req, res, next) {
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
        //localDate=localDate.add(1, 'days')
    }
    dm.dates=dates
    dm.datas=datas
    res.json({success:true,data:dm})
})
/* order page. */
router.all('/order/je/stat',async function(req, res, next) {
    let map={};
    let dm={};
    map.success=true
    map.data=dm
    let localDate=moment().subtract(7, 'days')
    let dates=[]
    let datas=[]
    for(let i=0;i<8;i++){
        dates.push(localDate.format("YYYY/MM/DD"))
        let conts=await repo.jestat(localDate.format("YYYY-MM-DD hh:mm:ss"),localDate.add(1, 'days').format("YYYY-MM-DD hh:mm:ss"));
        if(conts.data[0]['sum(g.amount)']) {
            datas.push(conts.data[0]['sum(g.amount)']);
        }else{
            datas.push(0)
        }
        //localDate=localDate.add(1, 'days')
    }
    dm.dates=dates
    dm.datas=datas
    res.json({success:true,data:dm})
})

router.all('/order/page', function(req, res, next) {
    req.body.page=req.body.page||req.query.page||1
    req.body.size=req.body.size||req.query.size||10
    repo.queryPage(req.body,r=>{
        res.json({success:true,data:r})
    })
})

router.all('/order/all', function(req, res, next) {
    repo.queryAll(req.body,r=>{
        res.json(r)
    })
})

router.all('/order/one', function(req, res, next) {
    repo.queryById(req.body,r=>{
        res.json(r)
    })
})

router.all('/order/save', function(req, res, next) {
    audit.fillData(req,req.body)
    repo.save(req.body,r=>{
        res.json(r)
    })
})

router.all('/order/delete', function(req, res, next) {
    repo.deleteById(req.body,r=>{
        res.json(r)
    })
})

router.all('/order/pay',async function(req, res, next) {
    let userInfo=req.session.userInfo
    let entity=req.body
    audit.fillData(req,req.body)
    if(userInfo.ye<entity.amount){
        res.json({
            success:false,
            msg:"余额不足"
        })
        return
    }
    userInfo.ye = userInfo.ye - entity.amount
    userRepo.save(userInfo,()=>{});
    if(entity.orderItem != null) {
        for (let i = 0; i < entity.orderItem.length; i++) {
            let orderItemEntity = entity.orderItem[i]
            if (orderItemEntity.carId != null) {
                shoppingCartRepo.del({id:orderItemEntity.carId},()=>{});
            }
            let goodsEntity=await goodsRepo.findById(orderItemEntity.goodsId);
            let goodsSkuEntity=await goodsSkuRepo.one({goodsId:orderItemEntity.goodsId,spec:orderItemEntity.goodsSpec});
            goodsEntity=goodsEntity.data
            goodsSkuEntity=goodsSkuEntity.data
            if(goodsEntity==null||goodsSkuEntity==null){
                res.json({success:false,msg:"商品不存在"})
                return
            }
            if(goodsEntity.status!=1){
                res.json({success:false,msg:"商品已下架"})
                return
            }
            if(goodsSkuEntity.cont<orderItemEntity.cont){
                res.json({success:false,msg:`商品 ${goodsEntity.title} ${goodsSkuEntity.spec} 库存不足`})
                return
            }
            goodsSkuEntity.cont = goodsSkuEntity.cont-orderItemEntity.cont
            goodsSkuRepo.save(goodsSkuEntity,()=>{});
        }
    }
    repo.save(entity,()=>{});
    res.json({success:true,msg:"支付成功"})
})

router.all('/order/nopay',async function(req, res, next) {
    let entity=req.body
    audit.fillData(req,req.body)
    if(entity.orderItem != null) {
        for (let i = 0; i < entity.orderItem.length; i++) {
            let orderItemEntity = entity.orderItem[i]
            if (orderItemEntity.carId != null) {
                shoppingCartRepo.del({id:orderItemEntity.carId},()=>{});
            }
            let goodsEntity=await goodsRepo.findById(orderItemEntity.goodsId);
            let goodsSkuEntity=await goodsSkuRepo.one({goodsId:orderItemEntity.goodsId,spec:orderItemEntity.goodsSpec});
            goodsEntity=goodsEntity.data
            goodsSkuEntity=goodsSkuEntity.data
            if(goodsEntity==null||goodsSkuEntity==null){
                res.json({success:false,msg:"商品不存在"})
                return
            }
            if(goodsEntity.status!=1){
                res.json({success:false,msg:"商品已下架"})
                return
            }
            if(goodsSkuEntity.cont<orderItemEntity.cont){
                res.json({success:false,msg:`商品 ${goodsEntity.title} ${goodsSkuEntity.spec} 库存不足`})
                return
            }
            goodsSkuEntity.cont = goodsSkuEntity.cont-orderItemEntity.cont
            goodsSkuRepo.save(goodsSkuEntity,()=>{});
        }
    }
    repo.save(entity,()=>{});
    res.json({success:true,msg:"支付成功"})
})

module.exports = router;
